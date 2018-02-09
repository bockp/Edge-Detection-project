const gpuLoG = () => (raster, graphContext, copy_mode = true) => 
{
	let id='LoG';
	console.log(id);
	
// Vertex Shader
	let src_vs = `#version 300 es
  
    in vec2 a_vertex;
    in vec2 a_texCoord;

    uniform vec2 u_resolution;
    
    out vec2 v_texCoord;
    
    void main() {
      v_texCoord = a_texCoord ;
      vec2 clipSpace = a_vertex * u_resolution * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1,-1), 0.0, 1.0);
    }
  `;
  
// Fragment Shader
let src_fs_log = `#version 300 es
  
    precision mediump float;
    
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    
    out vec4 outColor;
    
    void main(){
		
		float stepSizeX = 1.0 / float(textureSize(u_image,0).x);
		float stepSizeY = 1.0 / float(textureSize(u_image,0).y);
		
		float a01 = texture(u_image, vec2(v_texCoord.s, v_texCoord.t - 2.0*stepSizeY)).r;
		float a02 = texture(u_image, vec2(v_texCoord.s - 2.0*stepSizeX, v_texCoord.t)).r;
		float a03 = texture(u_image, vec2(v_texCoord.s + 2.0*stepSizeX, v_texCoord.t)).r;
		float a04 = texture(u_image, vec2(v_texCoord.s, v_texCoord.t + 2.0*stepSizeX)).r;
		
		float a11 = texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r;
		float a12 = texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r;
		float a13 = texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r;
		
		float a21 = texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r;
		float a22 = texture(u_image, v_texCoord).r;
		float a23 = texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r;
		
		float a31 = texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r;
		float a32 = texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r;
		float a33 = texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r;
		
		// convolution with 5x5 LoG kernel from http://fourier.eng.hmc.edu/e161/lectures/gradient/node8.html + threshold at 0 with step() function
		outColor.r = step(0.0, 1.0 * a01 + 1.0 * a11 + 2.0 * a12 + 1.0 * a13 + 1.0 * a02 + 2.0 * a21 - 16.0 * a22 + 2.0 * a23 + 1.0 * a03 + 1.0 * a31 + 2.0 * a32 + 1.0 * a33 + 1.0 * a04); 

		//outColor.r = LoG;
		outColor.g = outColor.r;
		outColor.b = outColor.r;
		outColor.a = 1.0;
     
    }`;

let shader_log = gpu.createProgram(graphContext,src_vs,src_fs_log);

 
   let gproc_log = gpu.createGPU(graphContext,raster.width,raster.height)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(raster)
    .redirectTo('fbo1','float32',0)
    .packWith(shader_log) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .run(); 
    
    console.log('LoG filter done...');
    
let src_fs_threshold = `#version 300 es
  
    precision mediump float;
    
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    
    out vec4 outColor;
    
    void main(){
		
		float stepSizeX = 1.0 / float(textureSize(u_image,0).x);
		float stepSizeY = 1.0 / float(textureSize(u_image,0).y);
	
		//get the 9 neighboring pixels values
		float a11 = texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r;
		float a12 = texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r;
		float a13 = texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r;
		
		float a21 = texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r;
		float a22 = texture(u_image, v_texCoord).r;
		float a23 = texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r;
		
		float a31 = texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r;
		float a32 = texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r;
		float a33 = texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r;
		
		if ((a22 == 1.0) && ( (a11 == 0.0) || (a12 == 0.0) || (a13 == 0.0) || (a21 == 0.0) || (a23 == 0.0) || (a31 == 0.0) || (a32 == 0.0) || (a33 == 0.0) ))
		{
			outColor.r = 0.0;
		}
		else
		{
			outColor.r = 1.0;
		}
		outColor.g = outColor.r;
		outColor.b = outColor.r;
		outColor.a = 1.0;
     
    }`;

let shader_threshold = gpu.createProgram(graphContext,src_vs,src_fs_threshold);  
    
    let gproc_threshold = gpu.createGPU(graphContext,raster.width,raster.height)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_log.framebuffers['fbo1'])
    .redirectTo('fbo2','float32',0)
    .packWith(shader_threshold) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .run(); 
    
    console.log('threshold done...'); 
    
let src_fs = `#version 300 es
  
    precision mediump float;
    
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    
    out vec4 outColor;
    
    void main(){
      outColor = vec4(texture(u_image, v_texCoord).rgb, 1.0);
    }`;
    

///////////

let the_shader = gpu.createProgram(graphContext,src_vs,src_fs);
    
  // Step #2: Create a gpu.Processor, and define geometry, attributes, texture, VAO, .., and run
  let gproc = gpu.createGPU(graphContext)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_threshold.framebuffers['fbo2'])
    .packWith(the_shader) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
.run();   
    
	return raster;
}

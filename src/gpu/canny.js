

const gpuGaussBlur5x5 = (raster, graphContext, copy_mode = true) => 
{
	//let ext = graphContext.context.getExtension('EXT_color_buffer_float');
	let id='test'
	
	console.log(raster.pixelData)
	
// Vertex Shader
	let src_vs = `#version 300 es
  
    in vec2 a_vertex;
    in vec2 a_texCoord;

    uniform vec2 u_resolution;
    
    out vec2 v_texCoord;
    
    void main() {
      v_texCoord = a_texCoord;
      vec2 clipSpace = a_vertex * u_resolution * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1,-1), 0.0, 1.0);
    }
  `;
// Fragment Shader
let src_fs_blurH = `#version 300 es
  
    precision mediump float;
    
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    uniform float u_kernel[5];
    
    out vec4 outColor;
    
    void main(){
    	vec4 sum = vec4(0.0);

		float stepSizeH = 1.0 / float(textureSize(u_image,0).y);
		//horizontal
		
		sum += texture(u_image, vec2(v_texCoord.x, v_texCoord.y - stepSizeH * 2.0 )) * u_kernel[0]; 
		sum += texture(u_image, vec2(v_texCoord.x, v_texCoord.y - stepSizeH)) * u_kernel[1];
		sum += texture(u_image, vec2(v_texCoord.x, v_texCoord.y )) * u_kernel[2];
		sum += texture(u_image, vec2(v_texCoord.x, v_texCoord.y + stepSizeH )) * u_kernel[3];
		sum += texture(u_image, vec2(v_texCoord.x, v_texCoord.y + stepSizeH * 2.0)) * u_kernel[4];
		sum.a = 1.0;
		outColor = sum;
     
    }`;

let shader_blurH = gpu.createProgram(graphContext,src_vs,src_fs_blurH);

  console.log('programs done...');
 
   let gproc_blurH = gpu.createGPU(graphContext,raster.width,raster.height)
  	.redirectTo('fbo1','float32',0)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(raster)
    .packWith(shader_blurH) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('u_kernel', new Float32Array([0.0625,0.25,0.375,0.25,0.0625]) )
    .run(); 
    console.log("blur H done");
    
    console.log(raster.pixelData)
 
// Fragment Shader V
let src_fs_blurV = `#version 300 es
  
    precision mediump float;
    
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    uniform float u_kernel[5];
    
    out vec4 outColor;
    
    void main(){
    	vec4 sum = vec4(0.0);

		float stepSizeV = 1.0 / float(textureSize(u_image,0).x);
		//vertical
		
		sum += texture(u_image, vec2(v_texCoord.x - stepSizeV * 2.0 , v_texCoord.y)) * u_kernel[0]; 
		sum += texture(u_image, vec2(v_texCoord.x - stepSizeV, v_texCoord.y)) * u_kernel[1];
		sum += texture(u_image, vec2(v_texCoord.x, v_texCoord.y )) * u_kernel[2];
		sum += texture(u_image, vec2(v_texCoord.x + stepSizeV, v_texCoord.y )) * u_kernel[3];
		sum += texture(u_image, vec2(v_texCoord.x + stepSizeV * 2.0, v_texCoord.y)) * u_kernel[4];
		
		sum.a = 1.0;
		outColor = sum;
     
    }`;  

let shader_blurV = gpu.createProgram(graphContext,src_vs,src_fs_blurV);

  console.log('programs done...');
    
  // Step #2: Create a gpu.Processor, and define geometry, attributes, texture, VAO, .., and run
  let gproc_blurV = gpu.createGPU(graphContext)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_blurH.framebuffers['fbo1'])
    .redirectTo('fbo2','float32',0)
    .packWith(shader_blurV) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('u_kernel', new Float32Array([0.0625,0.25,0.375,0.25,0.0625]) )
    .run();
    
	console.log("blur V done");
	
let src_fs = `#version 300 es
  precision mediump float;
  
  in vec2 v_texCoord;
  uniform sampler2D u_image;

  out vec4 outColor;
  
  void main() {
    outColor = vec4(texture(u_image, v_texCoord).rgb, 1.0); 
  }`;
  
  let shader = gpu.createProgram(graphContext,src_vs,src_fs);
  
	
	let gproc_blur= gpu.createGPU(graphContext)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_blurV.framebuffers['fbo2'])
    .packWith(shader) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .run();
  console.log(raster.pixelData)
  return raster
  
}

const gpuGaussBlur3x3 = (raster, graphContext, copy_mode = true) => 
{
	let id='gaussian_blur_3x3'
	
// Vertex Shader
	let src_vs = `#version 300 es
  
    in vec2 a_vertex;
    in vec2 a_texCoord;

    uniform vec2 u_resolution;
    
    out vec2 v_texCoord;
    
    void main() {
      v_texCoord = a_texCoord;
      vec2 clipSpace = a_vertex * u_resolution * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1,-1), 0.0, 1.0);
    }
  `;
// Fragment Shader
let src_fs_blurH = `#version 300 es
  
    precision mediump float;
    
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    uniform float u_kernel[3];
    
    out vec4 outColor;
    
    void main(){
    	vec4 sum = vec4(0.0);

		float stepSizeH = 1.0 / float(textureSize(u_image,0).y);
		//horizontal
		
		sum += texture(u_image, vec2(v_texCoord.x, v_texCoord.y - stepSizeH)) * u_kernel[0];
		sum += texture(u_image, vec2(v_texCoord.x, v_texCoord.y )) * u_kernel[1];
		sum += texture(u_image, vec2(v_texCoord.x, v_texCoord.y + stepSizeH )) * u_kernel[2];
		sum.a = 1.0;
		outColor = sum;
     
    }`;

let shader_blurH = gpu.createProgram(graphContext,src_vs,src_fs_blurH);

  console.log('programs done...');
 
   let gproc_blurH = gpu.createGPU(graphContext,raster.width,raster.height)
  	.redirectTo('fbo1','float32',0)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(raster)
    .packWith(shader_blurH) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('u_kernel', new Float32Array([0.25,0.5,0.25]) )
    .run(); 
    console.log("blur H done");
    
    console.log(raster.pixelData)
 
// Fragment Shader V
let src_fs_blurV = `#version 300 es
  
    precision mediump float;
    
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    uniform float u_kernel[3];
    
    out vec4 outColor;
    
    void main(){
    	vec4 sum = vec4(0.0);

		float stepSizeV = 1.0 / float(textureSize(u_image,0).x);
		//vertical
		
		sum += texture(u_image, vec2(v_texCoord.x - stepSizeV, v_texCoord.y)) * u_kernel[0];
		sum += texture(u_image, vec2(v_texCoord.x, v_texCoord.y )) * u_kernel[1];
		sum += texture(u_image, vec2(v_texCoord.x + stepSizeV, v_texCoord.y )) * u_kernel[2];
		
		sum.a = 1.0;
		outColor = sum;
     
    }`;  

let shader_blurV = gpu.createProgram(graphContext,src_vs,src_fs_blurV);

  console.log('programs done...');
    
  // Step #2: Create a gpu.Processor, and define geometry, attributes, texture, VAO, .., and run
  let gproc_blurV = gpu.createGPU(graphContext)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_blurH.framebuffers['fbo1'])
    .redirectTo('fbo2','float32',0)
    .packWith(shader_blurV) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('u_kernel', new Float32Array([0.25,0.5,0.25]) )
    .run();
    
	console.log("blur V done");
	
let src_fs = `#version 300 es
  precision mediump float;
  
  in vec2 v_texCoord;
  uniform sampler2D u_image;

  out vec4 outColor;
  
  void main() {
    outColor = vec4(texture(u_image, v_texCoord).rgb, 1.0); 
  }`;
  
  let shader = gpu.createProgram(graphContext,src_vs,src_fs);
  
	
	let gproc_blur= gpu.createGPU(graphContext)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_blurV.framebuffers['fbo2'])
    .packWith(shader) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .run();
  console.log(raster.pixelData)
  return raster
  
}

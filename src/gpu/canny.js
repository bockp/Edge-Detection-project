const gpuEdgeCanny = (low_thr,high_thr) => (raster, graphContext, copy_mode = true) => 
{
	let id='canny'
	
	console.log(id)
	
// VERTEX SHADER

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
   
  let samplerType= (raster.type === 'uint16') ? 'usampler2D' : 'sampler2D';
  
// HORIZONTAL GAUSSIAN BLUR
  let outColor_blurH;
  let stepSizeH;
  let sum_blurH;
  switch (raster.type) {
    case 'uint8': 
    {
    	stepSizeH = `1.0 / float(textureSize(u_image,0).y)`;
    	sum_blurH = `(vec4(0.0) + texture(u_image, vec2(v_texCoord.x, v_texCoord.y - stepSizeH * 2.0 )) * u_kernel[0] + texture(u_image, vec2(v_texCoord.x, v_texCoord.y - stepSizeH)) * u_kernel[1] + texture(u_image, vec2(v_texCoord.x, v_texCoord.y )) * u_kernel[2] + texture(u_image, vec2(v_texCoord.x, v_texCoord.y + stepSizeH )) * u_kernel[3] + texture(u_image, vec2(v_texCoord.x, v_texCoord.y + stepSizeH * 2.0)) * u_kernel[4])`;
    	break;
    }
    case 'rgba' : outColor_blurH = `texture(u_image, v_texCoord).rgb`; break; 
    case 'uint16': 
    {
    	stepSizeH = `1.0 / float(textureSize(u_image,0).y)`;
    	sum_blurH = `(vec4(0.0) + float(texture(u_image, vec2(v_texCoord.x, v_texCoord.y - stepSizeH * 2.0 )).r) * u_kernel[0] + float(texture(u_image, vec2(v_texCoord.x, v_texCoord.y - stepSizeH)).r) * u_kernel[1] + float(texture(u_image, vec2(v_texCoord.x, v_texCoord.y )).r) * u_kernel[2] + float(texture(u_image, vec2(v_texCoord.x, v_texCoord.y + stepSizeH )).r) * u_kernel[3] + float(texture(u_image, vec2(v_texCoord.x, v_texCoord.y + stepSizeH * 2.0)).r) * u_kernel[4])/maxUint16`;
    	break;
    }
    case 'float32':
    {
    	stepSizeH = `1.0 / float(textureSize(u_image,0).y)`;
    	sum_blurH = `(vec4(0.0) + texture(u_image, vec2(v_texCoord.x, v_texCoord.y - stepSizeH * 2.0 )).r * u_kernel[0] + texture(u_image, vec2(v_texCoord.x, v_texCoord.y - stepSizeH)).r * u_kernel[1] + texture(u_image, vec2(v_texCoord.x, v_texCoord.y )).r * u_kernel[2] + texture(u_image, vec2(v_texCoord.x, v_texCoord.y + stepSizeH )).r * u_kernel[3] + texture(u_image, vec2(v_texCoord.x, v_texCoord.y + stepSizeH * 2.0)).r * u_kernel[4])`;
    	break;
    }
  }
  
  
  const getFragmentSource_blurH = (samplerType,outVec,stepSize,sum) => {
    return `#version 300 es
    #pragma debug(on)

    precision mediump usampler2D;
    precision mediump float;
    
    in vec2 v_texCoord;
    const float maxUint16 = 65535.0;
    uniform ${samplerType} u_image;
    uniform float u_kernel[5];
    
    out vec4 outColor;
    
    void main() {	
    	float stepSizeH = float(${stepSize});	
		outColor = vec4(${sum});
		
		outColor.a=1.0;
    }`;
  }
  
	let shader_blurH = gpu.createProgram(graphContext,src_vs,getFragmentSource_blurH(samplerType,outColor_blurH,stepSizeH,sum_blurH));
 
   let gproc_blurH = gpu.createGPU(graphContext,raster.width,raster.height)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .redirectTo('fbo01','float32',0)
    .texture(raster)
    .packWith(shader_blurH) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('u_kernel', new Float32Array([0.0625,0.25,0.375,0.25,0.0625]) )
    .run(); 
    
    console.log("horizontal blur done..."); 

//VERTICAL GAUSSIAN BLUR

  let outColor_blurV;
  let stepSizeV;
  let sum_blurV;
  switch (raster.type) {
    case 'uint8': 
    {
    	stepSizeV = `1.0 / float(textureSize(u_image,0).x)`;
    	sum_blurV = `(vec4(0.0) + texture(u_image, vec2(v_texCoord.x - stepSizeV * 2.0 , v_texCoord.y)) * u_kernel[0] + texture(u_image, vec2(v_texCoord.x - stepSizeV, v_texCoord.y)) * u_kernel[1] + texture(u_image, vec2(v_texCoord.x, v_texCoord.y )) * u_kernel[2] + texture(u_image, vec2(v_texCoord.x + stepSizeV, v_texCoord.y )) * u_kernel[3] + texture(u_image, vec2(v_texCoord.x + stepSizeV * 2.0, v_texCoord.y)) * u_kernel[4])`;
    	break;
    }
    case 'rgba' : outColor_blurV = `texture(u_image, v_texCoord).rgb`; break; 
    case 'uint16': 
    {
    	stepSizeV = `1.0 / float(textureSize(u_image,0).x)`;
    	sum_blurV = `(vec4(0.0) + float(texture(u_image, vec2(v_texCoord.x - stepSizeV * 2.0 , v_texCoord.y)).r) * u_kernel[0] + float(texture(u_image, vec2(v_texCoord.x - stepSizeV, v_texCoord.y)).r) * u_kernel[1] + float(texture(u_image, vec2(v_texCoord.x, v_texCoord.y )).r) * u_kernel[2] + float(texture(u_image, vec2(v_texCoord.x + stepSizeV, v_texCoord.y )).r) * u_kernel[3] + float(texture(u_image, vec2(v_texCoord.x + stepSizeV * 2.0, v_texCoord.y)).r) * u_kernel[4])/maxUint16`;
    	break;
    }
    case 'float32': 
    {
    	stepSizeV = `1.0 / float(textureSize(u_image,0).x)`;
    	sum_blurV = `(vec4(0.0) + texture(u_image, vec2(v_texCoord.x - stepSizeV * 2.0 , v_texCoord.y)).r * u_kernel[0] + texture(u_image, vec2(v_texCoord.x - stepSizeV, v_texCoord.y)).r * u_kernel[1] + texture(u_image, vec2(v_texCoord.x, v_texCoord.y )).r * u_kernel[2] + texture(u_image, vec2(v_texCoord.x + stepSizeV, v_texCoord.y )).r * u_kernel[3] + texture(u_image, vec2(v_texCoord.x + stepSizeV * 2.0, v_texCoord.y)).r * u_kernel[4])`;
    	break;
    }
  }
  
  const getFragmentSource_blurV = (samplerType,outVec,stepSize,sum) => {
    return `#version 300 es
    #pragma debug(on)

    precision mediump usampler2D;
    precision mediump float;
    
    in vec2 v_texCoord;
    const float maxUint16 = 65535.0;
    uniform ${samplerType} u_image;
    uniform float u_kernel[5];
    
    out vec4 outColor;
    
    void main() {	
    	float stepSizeV = float(${stepSize});	
		outColor = vec4(${sum});
		
		outColor.a=1.0;
    }`;
  }

let shader_blurV = gpu.createProgram(graphContext,src_vs,getFragmentSource_blurV(samplerType,outColor_blurV,stepSizeV,sum_blurV));

let gproc_blurV = gpu.createGPU(graphContext)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_blurH.framebuffers['fbo01'])
    .redirectTo('fbo02','float32',0)
    .packWith(shader_blurV) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('u_kernel', new Float32Array([0.0625,0.25,0.375,0.25,0.0625]) )
    .run();
    
	console.log("vertical blur done..."); 

//SOBEL FILTER, GRADIENT MAGNITUDE AND ORIENTATION
  let outColor_sobel;
  let stepSizeX;
  let stepSizeY;
  let a11,a12,a13,a21,a22,a23,a31,a32,a33;
  switch (raster.type) {
    case 'uint8': 
    {
    	stepSizeX = `1.0 / float(textureSize(u_image,0).x)`;
    	stepSizeY = `1.0 / float(textureSize(u_image,0).y)`;
    	
    	a11 = `texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r`;
		a12 = `texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r`;
		a13 = `texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r`;
		
		a21 = `texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r`;
		a22 = `texture(u_image, v_texCoord).r`;
		a23 = `texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r`;
		
		a31 = `texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r`;
		a32 = `texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r`;
		a33 = `texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r`;
    	
    	break;
    }
    case 'rgba' : outColor_sobel = `texture(u_image, v_texCoord).rgb`; break; 
    case 'uint16': 
    {
    	stepSizeX = `1.0 / float(textureSize(u_image,0).x)`;
    	stepSizeY = `1.0 / float(textureSize(u_image,0).y)`;
    	
    	a11 = `float(texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r)`;
		a12 = `float(texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r)`;
		a13 = `float(texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r)`;
		
		a21 = `float(texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r)`;
		a22 = `float(texture(u_image, v_texCoord).r)`;
		a23 = `float(texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r)`;
		
		a31 = `float(texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r)`;
		a32 = `float(texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r)`;
		a33 = `float(texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r)`;
    	
    	break;
    }
    case 'float32': 
    {
    	stepSizeX = `1.0 / float(textureSize(u_image,0).x)`;
    	stepSizeY = `1.0 / float(textureSize(u_image,0).y)`;
    	
    	a11 = `texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r`;
		a12 = `texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r`;
		a13 = `texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r`;
		
		a21 = `texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r`;
		a22 = `texture(u_image, v_texCoord).r`;
		a23 = `texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r`;
		
		a31 = `texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r`;
		a32 = `texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r`;
		a33 = `texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r`;
    	
    	break;
    } 
  }
  
  const getFragmentSource_sobel = (samplerType,outVec,stepSizeX,stepSizeY,a11,a12,a13,a21,a22,a23,a31,a32,a33) => {
    return `#version 300 es
    #pragma debug(on)

    precision mediump usampler2D;
    precision mediump float;
    
    in vec2 v_texCoord;
    const float maxUint16 = 65535.0;
    uniform ${samplerType} u_image;
    const mat2 ROTATION_MATRIX = mat2(0.92388, 0.38268, -0.38268, 0.92388); // 1/16 turn rotation matrix
    uniform float u_kernel_H[9]; //wrong kernels (not flipped) in original version !! hahahahaha I am the best :)
    uniform float u_kernel_V[9];
    
    out vec4 outColor;
    
    void main() {	
    	float stepSizeX = float(${stepSizeX});
    	float stepSizeY = float(${stepSizeY});
    	//get the 9 neighboring pixel intensities
    	float a11 = float(${a11});	
    	float a12 = float(${a12});
    	float a13 = float(${a13});
    	float a21 = float(${a21});
    	float a22 = float(${a22});
    	float a23 = float(${a23});
    	float a31 = float(${a31});
    	float a32 = float(${a32});
    	float a33 = float(${a33});
    	
		//gradient vector
		vec2 sobel = vec2 (u_kernel_H[0] * a11 + u_kernel_H[1] * a12 + u_kernel_H[2] * a13 + u_kernel_H[3] * a21 + u_kernel_H[4] * a22 + u_kernel_H[5] * a23 + u_kernel_H[6] * a31 + u_kernel_H[7] * a32 + u_kernel_H[8] * a33, u_kernel_V[0] * a11 + u_kernel_V[1] * a12 + u_kernel_V[2] * a13 + u_kernel_V[3] * a21 + u_kernel_V[4] * a22 + u_kernel_V[5] * a23 + u_kernel_V[6] * a31 + u_kernel_V[7] * a32 + u_kernel_V[8] * a33);

		vec2 rotatedSobel = ROTATION_MATRIX * sobel;
		vec2 quadrantSobel = vec2(rotatedSobel.x * rotatedSobel.x - rotatedSobel.y * rotatedSobel.y, 2.0 * rotatedSobel.x * rotatedSobel.y);
		
		//gradient direction
		vec2 neighDir = vec2(step(-1.5, sign(quadrantSobel.x) + sign(quadrantSobel.y)), step(0.0, - quadrantSobel.x) - step(0.0, quadrantSobel.x) * step(0.0, - quadrantSobel.y));
		
		outColor.r = sqrt(sobel.x*sobel.x + sobel.y*sobel.y); //gradient magnitude
		outColor.gb = neighDir * 0.5 + vec2(0.5); // gradient direction
		outColor.a = 0.0; 
    }`;
  }

let shader_sobel = gpu.createProgram(graphContext,src_vs,getFragmentSource_sobel(samplerType,outColor_sobel,stepSizeX,stepSizeY,a11,a12,a13,a21,a22,a23,a31,a32,a33));

let gproc_sobel = gpu.createGPU(graphContext,raster.width,raster.height)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_blurV.framebuffers['fbo02'])
    .redirectTo('fbo1','float32',0)
    .packWith(shader_sobel) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('u_kernel_H', new Float32Array([1,0,-1,2,0,-2,1,0,-1]))
    .uniform('u_kernel_V', new Float32Array([-1,-2,-1,0,0,0,1,2,1]))
    .run(); 

  console.log('sobel filter done...');

//NON MAXIMUM SUPPRESSION, DOUBLE THRESHOLD   
 let outColor_nonmax;
  let texCoord;
  let n1;
  let n2;
  switch (raster.type) {
    case 'uint8': 
    {
    	texCoord=`texture(u_image, v_texCoord)`;
    	n1=`texture(u_image, v_texCoord + (neighDir * vec2(stepSizeX,stepSizeY)))`;
    	n2=`texture(u_image, v_texCoord - (neighDir * vec2(stepSizeX,stepSizeY)))`;
    	break;
    }
    case 'rgba' : outColor_blurV = `texture(u_image, v_texCoord).rgb`; break; 
    case 'uint16': 
    {
    	texCoord=`vec4(float(texture(u_image, v_texCoord)))`;
    	n1=`vec4(float(texture(u_image, v_texCoord + (neighDir * vec2(stepSizeX,stepSizeY)))))`;
    	n2=`vec4(float(texture(u_image, v_texCoord - (neighDir * vec2(stepSizeX,stepSizeY)))))`;
    	break;
    }
    case 'float32':
    {
    	texCoord=`texture(u_image, v_texCoord)`;
    	n1=`texture(u_image, v_texCoord + (neighDir * vec2(stepSizeX,stepSizeY)))`;
    	n2=`texture(u_image, v_texCoord - (neighDir * vec2(stepSizeX,stepSizeY)))`;
    	break;
    }
  }
  
  const getFragmentSource_nonmax = (samplerType,outVec,stepSizeX,stepSizeY,texCoord,n1,n2) => {
    return `#version 300 es
    #pragma debug(on)

    precision mediump usampler2D;
    precision mediump float;
    
    in vec2 v_texCoord;
    const float maxUint16 = 65535.0;
    uniform ${samplerType} u_image;
    uniform vec2 threshold;
    
    out vec4 outColor;
    
    void main() {
    
    	float stepSizeX = float(${stepSizeX});
    	float stepSizeY = float(${stepSizeY});
		vec4 texCoord = vec4(${texCoord});
		vec2 neighDir = texCoord.gb * 2.0 - vec2(1.0);
		vec4 n1 = vec4(${n1}); //grad of neighboring pixel in grad direction
		vec4 n2 = vec4(${n2}); //grad of opposite neighboring pixel in grad direction
		
		float edgeStrength = texCoord.r * step(max(n1.r,n2.r), texCoord.r); // step returns 0 if grad is not a maximum , returns 1 if grad is a maximum, then multiplied by grad of the current pixel
		outColor = vec4(smoothstep(threshold.s, threshold.t, edgeStrength),0.0,0.0,1.0); //returns a value between 0 and 1 if grad is between low thr and high thr
		
    }`;
  }

let shader_nonmax = gpu.createProgram(graphContext,src_vs,getFragmentSource_nonmax(samplerType,outColor_nonmax,stepSizeX,stepSizeY,texCoord,n1,n2));   
    
    let gproc_nonmax = gpu.createGPU(graphContext,raster.width,raster.height)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_sobel.framebuffers['fbo1'])
    .redirectTo('fbo2','float32',0)
    .packWith(shader_nonmax) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('threshold', new Float32Array([low_thr/255.0,high_thr/255.0]))
    .run(); 
    
    console.log('non maximum suppression done...'); 

//HYSTERESIS  
  let outColor_hysteresis;
  let edgeStrength;
  let a11_,a12_,a13_,a21_,a23_,a31_,a32_,a33_;
  switch (raster.type) {
    case 'uint8': 
    {    	
    	edgeStrength =`texture(u_image, v_texCoord).r`
    	
    	a11_ = `texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r`;
		a12_ = `texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r`;
		a13_ = `texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r`;
		
		a21_ = `texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r`;
		a23_ = `texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r`;
		
		a31_ = `texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r`;
		a32_ = `texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r`;
		a33_ = `texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r`;
    	
    	break;
    }
    case 'rgba' : outColor_hysteresis = `texture(u_image, v_texCoord).rgb`; break; 
    case 'uint16': 
    {
    	edgeStrength =`float(texture(u_image, v_texCoord).r)`
    	
    	a11_ = `float(texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r)`;
		a12_ = `float(texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r)`;
		a13_ = `float(texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r)`;
		
		a21_ = `float(texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r)`;
		a23_ = `float(texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r)`;
		
		a31_ = `float(texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r)`;
		a32_ = `float(texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r)`;
		a33_ = `float(texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r)`;
    	
    	break;
    }
    case 'float32':
    {    	
    	edgeStrength =`texture(u_image, v_texCoord).r`
    	
    	a11_ = `texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r`;
		a12_ = `texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r`;
		a13_ = `texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r`;
		
		a21_ = `texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r`;
		a23_ = `texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r`;
		
		a31_ = `texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r`;
		a32_ = `texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r`;
		a33_ = `texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r`;
    	
    	break;
    }
  }
  
  const getFragmentSource_hysteresis = (samplerType,outVec,stepSizeX,stepSizeY,edgeStrength,a11,a12,a13,a21,a23,a31,a32,a33) => {
    return `#version 300 es
    #pragma debug(on)

    precision mediump usampler2D;
    precision mediump float;
    
    in vec2 v_texCoord;
    const float maxUint16 = 65535.0;
    uniform ${samplerType} u_image;
    const mat2 ROTATION_MATRIX = mat2(0.92388, 0.38268, -0.38268, 0.92388); // 1/16 turn rotation matrix
    uniform float u_kernel_H[9]; //wrong kernels (not flipped) in original version !! hahahahaha I am the best :)
    uniform float u_kernel_V[9];
    
    out vec4 outColor;
    
    void main() {	
    	float stepSizeX = float(${stepSizeX});
    	float stepSizeY = float(${stepSizeY});
    	float edgeStrength = float(${edgeStrength});
    	//get the 8 neighboring pixels' edge strength
    	float a11 = float(${a11});	
    	float a12 = float(${a12});
    	float a13 = float(${a13});
    	float a21 = float(${a21});
    	float a23 = float(${a23});
    	float a31 = float(${a31});
    	float a32 = float(${a32});
    	float a33 = float(${a33});
    	
		float strongPixel = step(2.0, edgeStrength + a11 + a12 + a13 + a21 + a23 + a31 + a32 + a33); //accept weak pixel if the sum of edge strength is > 2.0
		float px = strongPixel + (edgeStrength - strongPixel) * step(0.49, abs(edgeStrength - 0.5)); // 1 if edge, 0 if not edge
		outColor = vec4(px,px,px,1.0); // white if edge, black if not edge
    }`;
  }

let shader_hysteresis = gpu.createProgram(graphContext,src_vs,getFragmentSource_hysteresis(samplerType,outColor_hysteresis,stepSizeX,stepSizeY,edgeStrength,a11_,a12_,a13_,a21_,a23_,a31_,a32_,a33_));


  console.log('hysteresis done...');    
    
    let gproc_hysteresis = gpu.createGPU(graphContext,raster.width,raster.height)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_nonmax.framebuffers['fbo2'])
    .packWith(shader_hysteresis) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .run(); 
    
  return raster;
  
}

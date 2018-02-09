/**
 * This function calculates the value of the Laplacian of Gaussian at a specific point in a matrix.
 * given the squaring of both x and y, the values of the Laplacian of Gaussian distribution
 * for (1,-1), (-1,1), (1,1) and (-1,-1) are the same, which gives the symmetrical aspect.
 *
 *
 * @param {integer} x - x value for which we want to calculate the Laplacian of Gaussian Function's output.
 * @param {integer} y - y value for which we want to calculate the Laplacian of Gaussian Function's output.
 * @param {double} sigma - Threshold chosen by user (affects the blurring impact of the gaussian kernel).
 * @return {double} - Laplacian of Gaussian Distribution value for given (x,y) pair and threshold value.
 *
 * @author peter bock
 */
const unitaryLoG = (x,y,sigma) => Math.exp(( -((x*x) + (y*y))/(2.0*sigma*sigma) ) ) * (-1/(Math.pow(sigma,4)*Math.PI)) * (1 - ((Math.pow(x,2) + Math.pow(y,2)) / (2*Math.pow(sigma,2))));


/**
 * Generates a kernel by using the given values. the generated kernel is centered around the middle, at coordinates (0,0).
 *
 * The chosen implementation closely follows the methodology laid out in this article:
 * @website https://softwarebydefault.com/2013/06/08/calculating-gaussian-kernels/
 *
 * @param {integer} kernelSize - The size of the 1D kernel to generate. This MUST be a non-even number !
 * @param {double} sigma - Threshold defined by user.

 * @return {array} - generated 2D kernel, stored in a 1D array.
 *
 * @author Peter Bock
 */



const kernelGenerator = (kernelSize,sigma,kernelFunction) =>
{

    let kernel = [];
    let kernelRadius = Math.floor(kernelSize/2);
    let val = 0;
    let counter = 0;

    for (let y = -kernelRadius; y <= kernelRadius; y++)
    {

		for(let x = -kernelRadius; x <= kernelRadius; x++)
		{
	    	val = kernelFunction(x,y,sigma);
	    	kernel[counter] = val;

	    	counter += 1;
		}
    }

    return kernel;
};




/**
 * Normalizes a given array
 *
 * @param {array} kernel - the array to normalize
 * @return {array} - normalized array.
 *
 * @author Peter Bock
 */
const normalize = (array) =>
{
	//TODO functionalize
    let z = 1.0 /array.reduce((sum,x) => sum+x ,0);
    let normalizedArray = array.map(x => x * z);

    return normalizedArray;
};



/**
 * This function calculates the Laplacian of Gaussian kernel, using the LoG unitary calculator and the normalize() function.
 *
 *
 * @param {int} kernelSize - size of the normalized Gaussian kernel to generate
 * @param {double} sigma - Threshold chosen by user (affects the blurring impact of the gaussian kernel).
 * @return {array} - Laplacian of Gaussian kernel
 *
 * @author peter bock
 */
const logKernel = (kernelSize,sigma) => normalize(kernelGenerator( kernelSize, sigma, unitaryLoG ));



const gpuEdgeLaplace = (low_thr,high_thr) => (raster, graphContext, copy_mode = true) => 
{

	let id='laplace'
	
	console.log(id)
	
	let valmax;
	if (raster.type === 'uint8')
	{
		valmax=255;
	}
	
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


// 1. Laplacian  of Gaussian application
    
// Fragment Shader 
let src_fs_sobel = `#version 300 es
    // idem to Cecilia's work
    // I (peter bock) have no idea how to make heads or tails of this. so I just studied Cecilia's work till I could make out which part should be different for the LoG algorithm.
    // pretty much none of this is my work.
    precision mediump float;
    
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    const mat2 ROTATION_MATRIX = mat2(0.92388, 0.38268, -0.38268, 0.92388); // 1/16 turn rotation matrix
    // this uniform float double table will contain the calculated LoG kernel for a given sigma.
    uniform float u_kernel_H[9];
    uniform float u_kernel_V[9];
    
    out vec4 outColor;
    
    void main(){
	
	float stepSizeX = 1.0 / float(textureSize(u_image,0).x);
	float stepSizeY = 1.0 / float(textureSize(u_image,0).y);
	
	//get the 9 neighboring pixel intensities
	float a11 = texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r;
	float a12 = texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r;
	float a13 = texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r;
	
	float a21 = texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r;
		float a22 = texture(u_image, v_texCoord).r;
	float a23 = texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r;
	
	float a31 = texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r;
	float a32 = texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r;
	float a33 = texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r;
	
	//gradient vector
	
	// this is where the results differ from Cecilia's work.
	// Given that the Laplacian kernel CANNOT be separated into Horizontal and Vertical aspects, it is necessary to calculate an entire kernel using the unitary LoG JS transposed into glsl.
	// This also makes the entire Blurring/Gaussian step in Cecilia's algorithm unnecessary, as LoG includes the Gaussian blur in it's kernel already.

	// not sure how to do this without the vec2, but since I'll only be using the X component I can just leave it as a vec2 anyway.
	
	vec2 laplace = vec2 (u_kernel_H[0] * a11 + u_kernel_H[1] * a12 + u_kernel_H[2] * a13 + u_kernel_H[3] * a21 + u_kernel_H[4] * a22 + u_kernel_H[5] * a23 + u_kernel_H[6] * a31 + u_kernel_H[7] * a32 + u_kernel_H[8] * a33,0);
	

	
	
	// I need to do a filtering step, and step(a,b) seems like it fits the bill.
	// I should be able to adjust the value in x according to the result step gives applied to it.

	float stepRes = step(255.0,laplace.x);
	if (stepRes == 1.0){laplace.x = 0.0;};
	
	outColor.r = laplace.x; 
	outColor.g = laplace.x;
	outColor.b = laplace.x; // utiliser les 3 canaux rend presque tout blanc X/
	outColor.a = 1.0;
	
    }`;
    
let shader_sobel = gpu.createProgram(graphContext,src_vs,src_fs_sobel);

  console.log('sobel filter done...');

	var startTime3,endTime3,time3;

 	startTime3 = Date.now();
 
   let gproc_sobel = gpu.createGPU(graphContext,raster.width,raster.height)
    .size(raster.width,raster.height)
    .redirectTo('fbo1','float32',0)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(raster)
    .packWith(shader_sobel) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
       .uniform('u_kernel_H', new Float32Array(logKernel(3,2)))
       .uniform('u_kernel_V', new Float32Array(logKernel(3,2)))
    .run(); 

	endTime3 = Date.now();	
	time3 = endTime3 - startTime3;
    
// Fragment Shader
let src_fs_nonmax = `#version 300 es
  
    precision mediump float;
    
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    uniform vec2 threshold;

    out vec4 outColor;
    
    void main(){

		float stepSizeX = 1.0 / float(textureSize(u_image,0).x);
		float stepSizeY = 1.0 / float(textureSize(u_image,0).y);

		vec4 texCoord = texture(u_image, v_texCoord);
		vec2 neighDir = texCoord.gb * 2.0 - vec2(1.0);
		
		vec4 n1 = texture(u_image, v_texCoord + (neighDir * vec2(stepSizeX,stepSizeY))); //grad of neighboring pixel in grad direction
		vec4 n2 = texture(u_image, v_texCoord - (neighDir * vec2(stepSizeX,stepSizeY))); //grad of opposite neighboring pixel in grad direction
		float edgeStrength = texCoord.r * step(max(n1.r,n2.r), texCoord.r); // step returns 0 if grad is not a maximum , returns 1 if grad is a maximum, then multiplied by grad of the current pixel
		outColor = vec4(smoothstep(threshold.s, threshold.t, edgeStrength),0.0,0.0,0.0); //returns a value between 0 and 1 if grad is between low thr and high thr 
     
    }`;

let shader_nonmax = gpu.createProgram(graphContext,src_vs,src_fs_nonmax);

  console.log('non maximum suppression done...');    
    
	var startTime4,endTime4,time4;

 	startTime4 = Date.now();

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
    .uniform('threshold', new Float32Array([low_thr/valmax,high_thr/valmax]))
    .run(); 

	endTime4 = Date.now();	
	time4 = endTime4 - startTime4;
    
// Fragment Shader
let src_fs_hysteresis = `#version 300 es
  
    precision mediump float;
    
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    
    out vec4 outColor;
    
    void main(){
		
		float stepSizeX = 1.0 / float(textureSize(u_image,0).x);
		float stepSizeY = 1.0 / float(textureSize(u_image,0).y);
	
		float edgeStrength = texture(u_image, v_texCoord).r;
	
		//get the 8 neighboring pixels' edge strength
		float a11 = texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r;
		float a12 = texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r;
		float a13 = texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r;
		
		float a21 = texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r;
		float a23 = texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r;
		
		float a31 = texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r;
		float a32 = texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r;
		float a33 = texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r;
		
		float strongPixel = step(2.0, edgeStrength + a11 + a12 + a13 + a21 + a23 + a31 + a32 + a33); //accept weak pixel if the sum of edge strength is > 2.0
		float px = strongPixel + (edgeStrength - strongPixel) * step(0.49, abs(edgeStrength - 0.5)); // 1 if edge, 0 if not edge
		outColor = vec4(px,px,px,1.0); // white if edge, black if not edge
     
    }`;

let shader_hysteresis = gpu.createProgram(graphContext,src_vs,src_fs_hysteresis);

  console.log('hysteresis done...'); 

	var startTime5,endTime5,time5;

 	startTime5 = Date.now();   
    
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

	endTime5 = Date.now();	
	time5 = endTime5 - startTime5;
 
  return raster;
  
}

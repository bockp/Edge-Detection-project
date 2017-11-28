/*
 *  TIMES: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of TIMES
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TIMES.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

const SOBEL_H = [-1, 0, 1,-2,0, 2,-1, 0, 1];
const SOBEL_V = [1, 2, 1,0,0, 0,-1, -2, -1];
const PREWITT_H = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
const PREWITT_V = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
const ROBERT_H = [0, 0, 0, 0, 0, 1, 0, -1, 0];
const ROBERT_V = [0, 0, 0, 0, 1, 0, 0, 0, -1];


const sumOfKernels = function (img, kerH, kerV, copy=true)
{
	const W = img.width;
	const H = img.height;
    let data = img.raster.pixelData;
	console.log("horizontal conv");
    Gx = convolve(img, kerH).raster.pixelData;
	console.log("vertical conv");
    Gy = convolve(img, kerV).raster.pixelData;
	console.log("gadient magnitude");
    let G = Gx.map((x,i) => Math.sqrt(Math.pow(Gx[i],2.0)+Math.pow(Gy[i],2.0)));
    console.log(G);
	return G;
}

const normalizeConvResult = function(data)
{
	console.log("normalization");
    let i;
    for (i=0; i<data.length; i++)
    {
    	if (data[i] < 0)
		{
			data[i]=0;
			
		}
		else if (data[i] > 255)
		{
			data[i]=255;
		}
    }
    console.log(data);
    return data;
}


const prewitt = function(img, copy=true)
{
	console.log("Prewitt filter");
	let G = sumOfKernels(img, PREWITT_H, PREWITT_V);
    G = normalizeConvResult(G);
    let output = new T.Image('uint8',img.width,img.height);
	output.setPixels(G);
    
    return output;
    
}

const sobel = function(img, copy=true)
{
	console.log("Sobel filter");
	let G = sumOfKernels(img, SOBEL_H, SOBEL_V);
    G = normalizeConvResult(G);
    let output = new T.Image('uint8',img.width,img.height);
	output.setPixels(G);
    
    return output;
    
}

const robertscross = function(img, copy=true)
{
	console.log("Robert's cross filter");
	let G = sumOfKernels(img, ROBERT_H, ROBERT_V);
    G = normalizeConvResult(G);
    let output = new T.Image('uint8',img.width,img.height);
	output.setPixels(G);
    
    return output;
    
}

/**
 * This function calculates the value of the Gaussian at a specific point in a matrix. given the squaring of both x and y,
 * the values of the Gaussian distribution for (1,-1), (-1,1), (1,1) and (-1,-1) are the same, which gives the symmetrical aspect.
 * 
 *
 * @param {integer} x - x value for which we want to calculate the Gaussian Function's output.
 * @param {integer} x - y value for which we want to calculate the Gaussian Function's output.
 * @param {double} sigma - the standard deviation of the function whose (x,y) we want to transform using the Gaussian Function.
 * @return {double} - Gaussian Distribution value for given (x,y) pair and standard deviation.
 *
 * @author Peter Bock
 */
const unitaryGaussian = (x,y,sigma) => Math.exp(( -((x*x) + (y*y))/(2.0*sigma*sigma) ) ) * (1/(2.0*(sigma*sigma)*Math.PI));
    

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


const kernelGenerator = (kernelSize,sigma,kernelFunction) => {
    

    let kernel = [];
    let kernelRadius = Math.floor(kernelSize/2);
    let val = 0;
    let counter = 0;
    
    for (let y = -kernelRadius; y <= kernelRadius; y++){

	for(let x = -kernelRadius; x <= kernelRadius; x++){
	    val = kernelFunction(x,y,sigma);
	    kernel[counter] = val;
	    
	    counter += 1;
	}
    } 
    
    return kernel;
}; 


/**
 * normalizes a given array
 *
 * @param {array} kernel - the array to normalize
 * @return {array} - normalized array.
 *
 * @author Peter Bock
 */
const normalize = (array) => {

    let sum = array.reduce((sum,x) => sum+x ,0);
    let z = 1.0 / sum;
    let normalizedArray = [];
    //let display = "";
    
    for (let i = 0; i < array.length; i++){
	
    
	
        normalizedArray[i] = array[i] * z;
	
	//display += parseFloat(gaussian2D[i]);
	
	//((i+1)%3===0) ? display += "\n" : display += "\t";
	
    } 


    //console.log(display);

    return normalizedArray;
};




/**
 * Uses the kernelGenerator() and normalize() functions to create a normalized Gaussian kernel.
 *
 * @param {int} kernelSize - size of the normalized Gaussian kernel to generate
 * @param {double} sigma - Standard deviation chosen by user (affects the blurring impact of the gaussian kernel).
 * @return {array} - normalized Gaussian kernel.
 *
 * @author Peter Bock
 */
const gaussianKernel = (kernelSize,sigma) => normalize(kernelGenerator( kernelSize, sigma, unitaryGaussian ));






// LAPLACIAN OF GAUSSIAN algorithm.

// laplacian of gaussian LoG first convolves the Gaussian and Laplacian filters together, then does a local maxima search.





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





//// MAXIMA SEARCH

/**
 * <Description>
 *
 * @param {type} <name> - <Description>
 * @return {type} - <Description>
 *
 * @author
 */









/**
 * <Description>
 *
 * @param {type} <name> - <Description>
 * @return {type} - <Description>
 *
 * @author
 */
const padding = function (data, W, H, dim, pad, copy=true) {
	
	//const pW=W+(pad*2);
	let pad_img = Array((W+(pad*2))*(H+(pad*2))).fill(0);
	for (let i=0; i<W*H; i++)
	{
		pad_img[(Math.floor(i/W)+1)*(W+(pad*2))+((i%W)+1)]=data[Math.floor(i/W)*W+(i%W)]
	} //try with reduce
	console.log((W+(pad*2))*(H+(pad*2)));
	console.log(data);
	console.log(pad_img);
		
	return pad_img;
}


/**
 * <Description>
 *
 * @param {type} <name> - <Description>
 * @return {type} - <Description>
 *
 * @author
 */
const convolve = function (img, kernel, copy=true) {
	const dim = Math.sqrt(kernel.length); //kernel dimension
	const pad = Math.floor(dim/2); //padding
	
	//FT
	console.log("Kernel length " + kernel.length+" Dim "+dim+" Pad "+pad+" ");
	if (dim % 2 !== 1) 
	{
        console.log("error in kernel dimensions");
    }
    const W=img.width;
    const H=img.height;
    const data=img.raster.pixelData;
	
	//FT
	//console.log("W " + img.width+" H "+img.height);
	for(idx = 0; idx < 12; idx++){
		//console.log(kernel[idx]);
	}
	
	console.log("padding");
	let pad_img = padding(data, img.width, img.height, Math.sqrt(kernel.length), Math.floor(dim/2), copy=true);
	
	console.log("convolving");
	let conv_img = Array(W*H).fill(0);
	
	let row_idx, col_idx, ker_i, img_i, ker_row_idx, ker_col_idx;
	for (row_idx = pad; row_idx <= H; row_idx++)
	{
		//console.log(col_idx); OK
		for (col_idx = pad; col_idx <= W; col_idx++)
		{
			//console.log(row_idx); OK
			let val=0;
			for (ker_row_idx= -pad; ker_row_idx <= pad; ker_row_idx ++)
			{
				for (ker_col_idx = -pad; ker_col_idx <= pad; ker_col_idx++)
				{
					ker_i = (ker_col_idx+pad) + (ker_row_idx+pad)*dim; //kernel index to iterate through kernel line by line
					//console.log("K " + ker_i); //OK
					img_i = (col_idx+ker_col_idx) + (row_idx + ker_row_idx)*(W+pad*2); // image index to iterate through portion of image (with pading) under kernel line by line , only get index of R value each time
					//console.log("I "+ img_i); //OK
					//console.log(pad_img[img_i]*kernel[ker_i]); //OK
					val += pad_img[img_i]*kernel[ker_i]; 
					
				}
			}
			//console.log("V " + val);
			
		    let i = (col_idx - pad) + (row_idx - pad)*W; // pixel index in the output image (no padding)
		
		conv_img[i]=val;
		

		}

	}
	
	console.log(conv_img);
	let output = new T.Image('uint8',img.width,img.height);
	output.setPixels(conv_img);
    
    return output;
}

























//next functions are for Canny algorithm, please de not modify 
	
const nonmax = function(data, W, H, grad, theta) 
{
	
	let newGrad=grad.slice(); //new grad values
	let i;
	for (i=0; i <= data.length; i++)
	{					
			if ( (i%W == (0 || W-1)) || (Math.floor(i/W) == (0 || H-1)) )
			{
				newGrad[i]=0; //suppress pixels at the edge of the input image
			}
			
			if ( (theta[i] == 0) && ( (grad[i] <= grad[i-1]) || (grad[i] <= grad[i+1]) ) ) //horizontal direction : compare with previous and next pixel
			{
				newGrad[i]=0;
			}
			
			if ( (theta[i] == 45) && ( (grad[i] <= grad[i%W-1+W*Math.floor(i/W)+1]) || (grad[i] <= grad[i%W+1+W*Math.floor(i/W)-1]) ) ) //NE-SO direction : compare with previous and next pixel
			{
				newGrad[i]=0;
			}
			
			if ( (theta[i] == 90) && ( (grad[i] <= grad[i%W-1+W*Math.floor(i/W)]) || (grad[i] <= grad[i%W+1+W*Math.floor(i/W)]) ) ) //vertical direction : compare with previous and next pixel
			{
				newGrad[i]=0;
			}
			
			if ( (theta[i] == 135) && ( (grad[i] <= grad[i%W-1+W*Math.floor(i/W)-1]) || (grad[i] <= grad[i%W+1+W*Math.floor(i/W)+1]) ) ) //NW-SE direction : compare with previous and next pixel
			{
				newGrad[i]=0;
			}		

	}
    return newGrad;

}

const hysteresis = function(data, W, H, strong_edges, thresholded_edges) 
{
	
	let edges=strong_edges.slice(); //final edge pixels
	let pixels=[];

	let i;
	for (i=1; i <= data.length-1; i++)
	{					
		if ( (thresholded_edges[i] === 1) && ( (thresholded_edges[i%W-1+W*Math.floor(i/W)-1] === 2) || (thresholded_edges[i%W+W*Math.floor(i/W)-1] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W)-1] === 2) || (thresholded_edges[i%W-1+W*Math.floor(i/W)] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W)] === 2)  || (thresholded_edges[i%W-1+W*Math.floor(i/W)+1] === 2) || (thresholded_edges[i%W+W*Math.floor(i/W)+1] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W)+1] === 2) ) ) //weak edge is next to a strong edge (8-connectivity)
		{
			pixels.push(i); //we keep the pixel
			edges[i]=255;
		}	
	}
	
	
	//Extend strong edges based on current pixels, in several passes
	while (pixels.length > 0)
	{
		let new_pixels=[];
		for (i=1; i < pixels.length; i++)  //selected weak edges  next to a non selected weak edge (8 connectivity)
		{
			if ( (thresholded_edges[i%W-1+W*Math.floor(i/W)-1] === 1) && (edges[i%W-1+W*Math.floor(i/W)-1] === 0) ) 
			{
				new_pixels.push(i%W-1+W*Math.floor(i/W)-1); //we keep the pixel
				edges[i%W-1+W*Math.floor(i/W)-1]=255;
			}
			if ( (thresholded_edges[i%W+W*Math.floor(i/W)-1] === 1) && (edges[i%W+W*Math.floor(i/W)-1] === 0) ) 
			{
				new_pixels.push(i%W+W*Math.floor(i/W)-1); //we keep the pixel
				edges[i%W+W*Math.floor(i/W)-1]=255;
			}
			if ( (thresholded_edges[i%W+1+W*Math.floor(i/W)-1] === 1) && (edges[i%W+1+W*Math.floor(i/W)-1] === 0) ) 
			{
				new_pixels.push(i%W+1+W*Math.floor(i/W)-1); //we keep the pixel
				edges[i%W+1+W*Math.floor(i/W)-1]=255;
			}
			if ( (thresholded_edges[i%W-1+W*Math.floor(i/W)] === 1) && (edges[i%W-1+W*Math.floor(i/W)] === 0) ) 
			{
				new_pixels.push(i%W-1+W*Math.floor(i/W)); //we keep the pixel
				edges[i%W-1+W*Math.floor(i/W)]=255;
			}
			if ( (thresholded_edges[i%W+1+W*Math.floor(i/W)] === 1) && (edges[i%W+1+W*Math.floor(i/W)] === 0) ) 
			{
				new_pixels.push(i%W+1+W*Math.floor(i/W)); //we keep the pixel
				edges[i%W+1+W*Math.floor(i/W)]=255;
			}
			if ( (thresholded_edges[i%W-1+W*Math.floor(i/W)+1] === 1) && (edges[i%W-1+W*Math.floor(i/W)+1] === 0) ) 
			{
				new_pixels.push(i%W-1+W*Math.floor(i/W)+1); //we keep the pixel
				edges[i%W-1+W*Math.floor(i/W)+1]=255;
			}
			if ( (thresholded_edges[i%W+W*Math.floor(i/W)+1] === 1) && (edges[i%W+W*Math.floor(i/W)+1] === 0) ) 
			{
				new_pixels.push(i%W+W*Math.floor(i/W)+1); //we keep the pixel
				edges[i%W+W*Math.floor(i/W)+1]=255;
			}
			if ( (thresholded_edges[i%W+1+W*Math.floor(i/W)+1] === 1) && (edges[i%W+1+W*Math.floor(i/W)+1] === 0) ) 
			{
				new_pixels.push(i%W+1+W*Math.floor(i/W)+1); //we keep the pixel
				edges[i%W+1+W*Math.floor(i/W)+1]=255;
			}
		pixels=new_pixels;
		}
	}
	

    return edges;

}

const canny = function(img, low_thr, high_thr, sigma=2.0, copy=true)
{
	const W = img.width;
	const H = img.height;
    let data = img.raster.pixelData;
	//TODO convert rgb to greyscale
	//TODO gaussian filtering (init + convolve)
	//console.log("gaussian filtering (3x3 kernel)");
	//const gaussian_ker = gaussianKernel(3,1.0);
	//let data = convolve(img, gaussian_ker);
	//img.setPixels(data);
	
	console.log("horizontal sobel");
    Gx = convolve(img, SOBEL_H).raster.pixelData;
	console.log("vertical sobel");
    Gy = convolve(img, SOBEL_V).raster.pixelData;
	console.log("gadient magnitude");
    let G = Gx.map((x,i) => Math.sqrt(Math.pow(Gx[i],2.0)+Math.pow(Gy[i],2.0)));
    G = normalizeConvResult(G);
    console.log(G);
    console.log("intensity gradient orientation");
    const theta = Gx.map((x,i) => Math.atan2(Gy[i],Gx[i])*(180/Math.PI)); //get angle in rad and convert to degrees
    console.log(theta);
    let i;
    for (i=0; i<theta.length; i++)
    {
    	if (Math.round(Math.abs(theta[i])) < 45)
    	{
    		theta[i]=0;
    	}
    	else if ((Math.round(Math.abs(theta[i])) >= 45) && (Math.round(Math.abs(theta[i])) < 90))
    	{
    		theta[i]=45;
    	}
    	else if ((Math.round(Math.abs(theta[i])) >= 90) && (Math.round(Math.abs(theta[i])) < 135))
    	{
    		theta[i]=90;
    	}
    	else 
    	{
    		theta[i]=135;
    	}
    }
    console.log(theta);
    //non-maximum suppression
    console.log("non-maximum suppression");
    let newGrad = nonmax(data, W, H, G, theta);
    console.log(newGrad);
    //double threshold
    console.log("double threshold");
    const strong_edges = newGrad.map(x => x>high_thr ? x=255 : x=0);
    console.log(strong_edges); //ok
    const thresholded_edges = newGrad.map(function (x) 
    {
    	if (x > high_thr)
    	{
    		x=2; //strong edge
    	}
    	else if (x > low_thr)
    	{
    		x=1; //weak edge
    	}
    	else
    	{
    		x=0;
    	}
    	return x;
    }); 
    console.log(thresholded_edges); 
    
    //edge tracing with hysteresis : weak pixels near strong pixels
    console.log("hysteresis"); 
    let edges = hysteresis(data, W, H, strong_edges, thresholded_edges);
    console.log(edges);
    
    let output = new T.Image('uint8',img.width,img.height);
	output.setPixels(edges);
    
    return output;
}

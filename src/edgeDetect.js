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
 * This program is distributed in the hope that it will be useful,
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
 * Peter Bock
 * Cecilia Ostertag
 * Ophelie Thierry
 */
 
/******************************
KERNELS
*******************************/

const SOBEL_H = [1, 0, -1,2,0, -2,1, 0, -1]; 
const SOBEL_V = [1, 2, 1,0,0, 0,-1, -2, -1];
const PREWITT_H = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
const PREWITT_V = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
const ROBERT_H = [0, 0, 0, 0, 1, 0, 0, 0, -1];
const ROBERT_V = [0, 0, 0, 0, 0, 1, 0, -1, 0];

/******************************
UTILITY FUNCTIONS
*******************************/

const word_to_rgb = (word) =>
{
	a = (word & 0xFF000000) >> 24;
	r = (word & 0x000000FF);
	g = (word & 0x0000FF00) >> 8;
	b = (word & 0x00FF0000) >> 16;

	return [a,r,g,b];
}

const to8bit = (img, copy=true) =>
{
	let data = img.raster.pixelData;
	let data8bit = data.map((x) => 0.21*word_to_rgb(x)[1]+0.72*word_to_rgb(x)[2]+0.07*word_to_rgb(x)[3]);

	let output = new T.Image('uint8',img.width,img.height);
	output.setPixels(data8bit);

    return output;
}

const gradient = (img, kerH, kerV, copy=true) =>
{
    Gx = convolve(img, kerH).raster.pixelData;
    Gy = convolve(img, kerV).raster.pixelData;
	return Gx.map((x,i) => Math.sqrt(Math.pow(Gx[i],2.0)+Math.pow(Gy[i],2.0)));
}

const normalizeConvResult = function(data,type)
{
    let i;
    for (i=0; i<data.length; i++)
    /* TODO THIS IS NOT WORKING T________________T
    let newdata = [];
    data.forEach((px) =>
    {
    	let out;
		((px < 0) && (type != "float32")) ? out=0 : out=px ;
		((px < -1) && (type === "float32")) ? out=-1 : out=px ;
		((px > 255) && (type === "uint8")) ? out=255 : out=px ;
		((px > 65535) && (type === "uint16")) ? out=65535 : out=px ;
		((px > 1) && (type === "float32")) ? out=1 : out=px ;
		newdata.push(out);
    });
    */
    
    {
		((data[i] < 0) && (type != "float32")) ? data[i]=0 : data[i]=data[i] ;
		((data[i] < -1) && (type === "float32")) ? data[i]=-1 : data[i]=data[i] ;
		((data[i] > 255) && (type === "uint8")) ? data[i]=255 : data[i]=data[i] ;
		((data[i] > 65535) && (type === "uint16")) ? data[i]=65535 : data[i]=data[i] ;
		((data[i] > 1) && (type === "float32")) ? data[i]=1 : data[i]=data[i] ;
    }
    
    return data;
}

const theta4directions = (theta) =>
{
	let i;
    for (i=0; i<theta.length; i++)
    {
    	( (Math.round(Math.abs(theta[i])) < 45/2) || (Math.round(Math.abs(theta[i])) > (135 + 45/2)) ) ? theta[i]=0 : theta[i]=theta[i];
    	((Math.round(Math.abs(theta[i])) >= 45/2) && (Math.round(Math.abs(theta[i])) < (90 - 45/2) )) ? theta[i]=45 : theta[i]=theta[i];
    	((Math.round(Math.abs(theta[i])) >= (90 -45/2) ) && (Math.round(Math.abs(theta[i])) < (135 - 45/2) )) ? theta[i]=90 : theta[i]=theta[i];
		((Math.round(Math.abs(theta[i])) >= (135 -45/2) ) && (Math.round(Math.abs(theta[i])) < (135 + 45/2) )) ? theta[i]=135 : theta[i]=theta[i];
    }
    return theta;
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
const unitaryGaussian = (x,y,sigma) => Math.exp(( -(Math.pow(x,2) + Math.pow(y,2))/(2.0*Math.pow(sigma,2)) ) ) * (1/(2.0*Math.pow(sigma,2)*Math.PI));

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
 * normalizes a given array
 *
 * @param {array} kernel - the array to normalize
 * @return {array} - normalized array.
 *
 * @author Peter Bock
 */
const normalize = (array) => 
{

    let sum = array.reduce((sum,x) => sum+x ,0);
    let z = 1.0 / sum;
    let normalizedArray = [];

    for (let i = 0; i < array.length; i++)
    {
        normalizedArray[i] = array[i] * z;
    }

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


/**
 * <Description>
 *
 * @param {type} <name> - <Description>
 * @return {type} - <Description>
 *
 * @author
 */
const padding = function (data, W, H, dim, pad, copy=true) {

	let pad_img = Array((W+(pad*2))*(H+(pad*2))).fill(0);
	for (let i=0; i<W*H; i++)
	{
		pad_img[(Math.floor(i/W)+1)*(W+(pad*2))+((i%W)+1)]=data[Math.floor(i/W)*W+(i%W)]
	} //TODO try with reduce

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

	let pad_img = padding(data, img.width, img.height, Math.sqrt(kernel.length), Math.floor(dim/2), copy=true);

	let conv_img = Array(W*H).fill(0);

	let row_idx, col_idx, ker_i, img_i, ker_row_idx, ker_col_idx;
	for (row_idx = pad; row_idx <= H; row_idx++)
	{
		for (col_idx = pad; col_idx <= W; col_idx++)
		{
			let val=0;
			for (ker_row_idx= -pad; ker_row_idx <= pad; ker_row_idx ++)
			{
				for (ker_col_idx = -pad; ker_col_idx <= pad; ker_col_idx++)
				{
					ker_i = (ker_col_idx+pad) + (ker_row_idx+pad)*dim; //kernel index to iterate through kernel line by line
					img_i = (col_idx+ker_col_idx) + (row_idx + ker_row_idx)*(W+pad*2); // image index to iterate through portion of image (with pading) under kernel line by line , only get index of R value each time
					val += pad_img[img_i]*kernel[ker_i];

				}
			}

		    let i = (col_idx - pad) + (row_idx - pad)*W; // pixel index in the output image (no padding)

		conv_img[i]=val;

		}

	}

	let output = new T.Image(img.type,img.width,img.height);
	output.setPixels(conv_img);

    return output;
}

/******************************
PREWITT, SOBEL, ROBERT'S CROSS
*******************************/

const prewitt = (img, copy=true) =>
{
	(img.type === 'rgba') ?	img = to8bit(img) : img=img;
	console.log("Prewitt filter");
	let G = normalizeConvResult(gradient(img, PREWITT_H, PREWITT_V),img.type);
    let output = new T.Image(img.type,img.width,img.height);
	output.setPixels(G);

    return output;

}

const sobel = (img, copy=true) =>
{
	(img.type === 'rgba') ?	img = to8bit(img) : img=img;
	console.log("Sobel filter");
	let G = normalizeConvResult(gradient(img, SOBEL_H, SOBEL_V),img.type);
    let output = new T.Image(img.type,img.width,img.height);
	output.setPixels(G);

    return output;

}

const robertscross = (img, copy=true) =>
{
	(img.type === 'rgba') ?	img = to8bit(img) : img=img;
	console.log("Robert's cross filter");
	let G = normalizeConvResult(gradient(img, ROBERT_H, ROBERT_V),img.type);
    let output = new T.Image(img.type,img.width,img.height);
	output.setPixels(G);

    return output;

}

/******************************
LAPLACIAN OF GAUSSIAN
*******************************/

const LoG = (img, sigma=2.0, copy=true) =>
{
	(img.type === 'rgba') ?	img = to8bit(img) : img=img;
	
	const W = img.width;
	let ker = logKernel(9,sigma);
	let log_data = convolve(img, ker).raster.pixelData;
	//threshold LoG output to 0
	let thr_img = log_data.map((x) => (x >= 0) ? x=0 : x=255); //set foreground and background according to the sign of the LoG
	let zero_cross=[];
	thr_img.forEach((px,i) =>
	{
		( (thr_img[i] === 255) && ( (thr_img[i%W-1+W*Math.floor(i/W -1)] === 0) || (thr_img[i%W+W*Math.floor(i/W -1)] === 0) || (thr_img[i%W+1+W*Math.floor(i/W -1)] === 0) || (thr_img[i%W-1+W*Math.floor(i/W)] === 0) || (thr_img[i%W+1+W*Math.floor(i/W)] === 0)  || (thr_img[i%W-1+W*Math.floor(i/W +1)] === 0) || (thr_img[i%W+W*Math.floor(i/W +1)] === 0) || (thr_img[i%W+1+W*Math.floor(i/W +1)] === 0) ) )  ? zero_cross.push(255) : zero_cross.push(0); ;//foreground point has at least one background neighbor so it is a zero-crossing
	});

	let output = new T.Image('uint8',img.width,img.height);
	output.setPixels(zero_cross);

    return output;
}

/******************************
LAPLACIAN OF GAUSSIAN
*******************************/

const nonmax = (data, W, H, grad, theta, type) =>
{

	let valnull;
	(type === 'float32') ? valnull=-1 : valnull=0; //lowest value according to image type
	let newGrad=[]; //new grad values
	grad.forEach((val,i) =>
	{
			( ( (i%W == (0 || W-1)) || (Math.floor(i/W) == (0 || H-1)) ) ||

			( (theta[i] == 0) && ( (grad[i] <= grad[i-1]) || (grad[i] <= grad[i+1]) ) ) || //horizontal direction : compare with previous and next pixel

			( (theta[i] == 45) && ( (grad[i] <= grad[i%W-1+W*Math.floor(i/W + 1)]) || (grad[i] <= grad[i%W+1+W*Math.floor(i/W - 1)]) ) ) || //NE-SO direction : compare with previous and next pixel

			( (theta[i] == 90) && ( (grad[i] <= grad[i%W-1+W*Math.floor(i/W)]) || (grad[i] <= grad[i%W+1+W*Math.floor(i/W)]) ) ) || //vertical direction : compare with previous and next pixel

			( (theta[i] == 135) && ( (grad[i] <= grad[i%W-1+W*Math.floor(i/W - 1)]) || (grad[i] <= grad[i%W+1+W*Math.floor(i/W + 1)]) ) )  ) //NW-SE direction : compare with previous and next pixel
			 
			? newGrad.push(valnull) : newGrad.push(grad[i]) ; 
	});
    return newGrad;

}

const hysteresis = (data, W, H, strong_edges, thresholded_edges) =>
{

	let edges=strong_edges.slice(); //final edge pixels
	let pixels=[];

	edges.forEach((val,i) =>
	{
		if ( (thresholded_edges[i] === 1) && ( (thresholded_edges[i%W-1+W*Math.floor(i/W-1)] === 2) || (thresholded_edges[i%W+W*Math.floor(i/W-1)] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W-1)] === 2) || (thresholded_edges[i%W-1+W*Math.floor(i/W)] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W)] === 2)  || (thresholded_edges[i%W-1+W*Math.floor(i/W+1)] === 2) || (thresholded_edges[i%W+W*Math.floor(i/W +1)] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W +1)] === 2) ) ) //weak edge is next to a strong edge (8-connectivity)
		{
			pixels.push(i); //we keep the pixel
			edges[i]=255;
		}
	});


	//Extend strong edges based on current pixels, in several passes
	while (pixels.length > 0)
	{
		let new_pixels=[];
		//select weak edges  next to a non selected weak edge (8 connectivity)
		pixels.forEach((px,i) =>
		{
			if ( (thresholded_edges[i%W-1+W*Math.floor(i/W -1)] === 1) && (edges[i%W-1+W*Math.floor(i/W - 1)] === 0) )
			{
				new_pixels.push(i%W-1+W*Math.floor(i/W-1)); //we keep the pixel
				edges[i%W-1+W*Math.floor(i/W - 1)]=255;
			}
			if ( (thresholded_edges[i%W+W*Math.floor(i/W - 1)] === 1) && (edges[i%W+W*Math.floor(i/W - 1)] === 0) )
			{
				new_pixels.push(i%W+W*Math.floor(i/W - 1)); //we keep the pixel
				edges[i%W+W*Math.floor(i/W -1)]=255;
			}
			if ( (thresholded_edges[i%W+1+W*Math.floor(i/W - 1)] === 1) && (edges[i%W+1+W*Math.floor(i/W - 1)] === 0) )
			{
				new_pixels.push(i%W+1+W*Math.floor(i/W - 1)); //we keep the pixel
				edges[i%W+1+W*Math.floor(i/W - 1)]=255;
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
			if ( (thresholded_edges[i%W-1+W*Math.floor(i/W + 1)] === 1) && (edges[i%W-1+W*Math.floor(i/W + 1)] === 0) )
			{
				new_pixels.push(i%W-1+W*Math.floor(i/W + 1)); //we keep the pixel
				edges[i%W-1+W*Math.floor(i/W + 1)]=255;
			}
			if ( (thresholded_edges[i%W+W*Math.floor(i/W + 1)] === 1) && (edges[i%W+W*Math.floor(i/W + 1)] === 0) )
			{
				new_pixels.push(i%W+W*Math.floor(i/W + 1)); //we keep the pixel
				edges[i%W+W*Math.floor(i/W + 1)]=255;
			}
			if ( (thresholded_edges[i%W+1+W*Math.floor(i/W + 1)] === 1) && (edges[i%W+1+W*Math.floor(i/W +1)] === 0) )
			{
				new_pixels.push(i%W+1+W*Math.floor(i/W + 1)); //we keep the pixel
				edges[i%W+1+W*Math.floor(i/W + 1)]=255;
			}
		pixels=new_pixels;
		});
	}

    return edges;
}

const canny = (img, low_thr, high_thr, sigma=2.0, copy=true) =>
{
	(img.type === 'rgba') ? img = to8bit(img) : img=img;
	if (img.type === 'uint16')
	{
		low_thr*=256;
		high_thr*=256;
	}
	if (img.type === 'float32')
	{
		low_thr=low_thr/128-1.0;
		high_thr=high_thr/128-1.0;
	}
	console.log("gaussian filtering (9x9 kernel)");
	img = convolve(img, gaussianKernel(9,sigma));
	let data = img.raster.pixelData;

	console.log("compute gradient magnitude and orientation");
    Gx = convolve(img, SOBEL_H).raster.pixelData;
    Gy = convolve(img, SOBEL_V).raster.pixelData;
    let G = Gx.map((x,i) => Math.sqrt(Math.pow(Gx[i],2.0)+Math.pow(Gy[i],2.0)));
    G = normalizeConvResult(G,img.type);
    let theta = Gx.map((x,i) => Math.atan2(Gy[i],Gx[i])*(180/Math.PI)); //get angle in rad and convert to degrees

	//TODO make theta4directions work with map, still doesn't work :(
	// we need to have 4 values for theta : 0, 45, 90, 135
    theta = theta4directions(theta);
    
    //non-maximum suppression
    console.log("non-maximum suppression");
    let newGrad = nonmax(data, img.width, img.height, G, theta, img.type);
    
    //double threshold (we stop working on the gradient and start creating the binary edge
    console.log("double threshold");
    const strong_edges = newGrad.map(x => x>high_thr ? x=255 : x=0);
    const thresholded_edges = newGrad.map((x) =>
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

    //edge tracing with hysteresis : weak pixels near strong pixels
    console.log("hysteresis");
    let edges = hysteresis(data, img.width, img.height, strong_edges, thresholded_edges);

    let output = new T.Image('uint8',img.width,img.height);
	output.setPixels(edges);

    return output;
}

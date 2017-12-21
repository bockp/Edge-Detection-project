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
const SOBEL_V = [-1, -2, -1,0,0, 0,1, 2, 1];
const PREWITT_H = [1, 0, -1, 1, 0, -1, 1, 0, -1];
const PREWITT_V = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
const ROBERT_H = [0, -1, 0, 1, 0, 0, 0, 0, 0];
const ROBERT_V = [-1, 0, 0, 0, 1, 0, 0, 0, 0];

/******************************
UTILITY FUNCTIONS
*******************************/

/**
 * Computes the gradient magnitude of an image given an horizontal and a vertical kernel.
 *
 *
 * @param {raster} raster - Input raster
 * @param {array} kerH - Horizontal kernel
 * @param {array} kerV - Vertical kernel
 *
 * @author Ophelie Thierry
 */

const gradient = (raster, kerH, kerV, copy_mode=true) =>
{
    Gx = convolve(raster, kerH);
    Gy = convolve(raster, kerV);
	return Gx.map((x,i) => Math.sqrt(Math.pow(Gx[i],2.0)+Math.pow(Gy[i],2.0)));
}

/**
 * Normalize the result of a convolution, by setting values inferior to the minimal value to be equal to the minimal value, and values superior to the maximal value to be equal to the maximal value (min and max values depend on the type of the image)
 *
 *
 * @param {array} data - Image pixels values
 * @param {string} type - Image type
 *
 * @author Cecilia Ostertag
 */

const normalizeConvResult = (data,type) =>
{
    let i;
    for (i=0; i<data.length; i++)
    {
		((data[i] < 0) && (type != "float32")) ? data[i]=0 : data[i]=data[i] ;
		((data[i] < -1) && (type === "float32")) ? data[i]=-1 : data[i]=data[i] ;
		((data[i] > 255) && (type === "uint8")) ? data[i]=255 : data[i]=data[i] ;
		((data[i] > 65535) && (type === "uint16")) ? data[i]=65535 : data[i]=data[i] ;
		((data[i] > 1) && (type === "float32")) ? data[i]=1 : data[i]=data[i] ;
    }

    return data;
}

/**
 * Rounds the gradient orientation (theta) values into four directions : 0, 45, 90, and 135 degrees represented by the numbers 0, 1, 2, and 3
 *
 *
 * @param {array} theta - Image gradient orientation values
 *
 * @author Cecilia Ostertag
 */


/* original non-functional version. tests indicate both versions return the samle output, but just in case:




const theta4directions = (theta) =>
{
	// TODO functionalize
    let i;
    for (i=0; i<theta.length; i++)
    {
    	theta[i] = ((Math.round(theta[i] * (5.0 / Math.PI)) + 5) % 5) %4;
    	}
    return theta;
}




*/

const theta4directionsFunct = (theta) => theta.map(x => ((Math.round(x * (5.0 / Math.PI)) + 5) % 5) % 4);



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
 * Normalizes a given array
 *
 * @param {array} kernel - the array to normalize
 * @return {array} - normalized array.
 *
 * @author Peter Bock
 */

/* non-functional version.

const normalize = (array) =>
{
	//TODO functionalize
    let sum = array.reduce((sum,x) => sum+x ,0);
    let z = 1.0 / sum;
    let normalizedArray = [];

    for (let i = 0; i < array.length; i++)
    {
        normalizedArray[i] = array[i] * z;
    }

    return normalizedArray;
};

*/
const normalize = (array) =>
{
	//TODO functionalize
    let z = 1.0 /array.reduce((sum,x) => sum+x ,0);
    let normalizedArray = array.map(x => x * z);

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
 * Returns a padded version of an image, to be used for a convolution with a given kernel
 *
 *
 * @param {array} data - Image pixels values
 * @param {number} W - Image width
 * @param {number} H - Image height
 * @param {number} pad - Padding size (depends on kernel dimension)
 *
 * @author Cecilia Ostertag
 */
const padding = (data, W, H, pad, copy_mode=true) =>
{
	let pad_img = Array((W+(pad*2))*(H+(pad*2))).fill(0);
	for (let i=0; i<data.length; i++)
	{
		pad_img[(Math.floor(i/W+1))*(W+(pad*2))+((i%W)+1)]=data[Math.floor(i/W)*W+(i%W)]
	}

	return pad_img;
}


/**
 * Convolves an image with a given kernel
 *
 *
 * @param {raster} raster - Input raster
 * @param {array} kernel - Kernel
 *
 * @author Cecilia Ostertag
 */
const convolve = (raster, kernel, copy_mode=true) =>
{
	const dim = Math.sqrt(kernel.length); //kernel dimension
	const pad = Math.floor(dim/2); //padding

	//console.log("Kernel length " + kernel.length+" Dim "+dim+" Pad "+pad+" ");
	if (dim % 2 !== 1)
	{
        console.log("error in kernel dimensions");
    }
    const W=raster.width;
    const H=raster.height;
    const data=raster.pixelData;

	let pad_img = padding(data, raster.width, raster.height, pad, copy_mode=true);

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

    return conv_img;
}

/******************************
PREWITT, SOBEL, ROBERT'S CROSS
*******************************/

/**
 * Find the edges in an image using Prewitt operator
 *
 *
 * @author Ophelie Thierry
 */

const prewitt = () => (raster, copy_mode=true) =>
{
	let output = T.Raster.from(raster,copy_mode);
	output.type = raster.type;
	output.pixelData = normalizeConvResult(gradient(raster, PREWITT_H, PREWITT_V), raster.type);

    return output;
}

/**
 * Find the edges in an image using Sobel operator
 *
 *
 * @author Ophelie Thierry
 */

const sobel = () => (raster, copy_mode=true) =>
{
	let output = T.Raster.from(raster,copy_mode);
	output.type = raster.type;
	output.pixelData = normalizeConvResult(gradient(raster, SOBEL_H, SOBEL_V), raster.type);

    return output;
}

/**
 * Find the edges in an image using Robert's cross operator
 *
 *
 * @author Ophelie Thierry
 */

const robertscross = () => (raster, copy_mode=true) =>
{
	let output = T.Raster.from(raster,copy_mode);
	output.type = raster.type;
	output.pixelData = normalizeConvResult(gradient(raster, ROBERT_H, ROBERT_V), raster.type);
    return output;
}

/******************************
LAPLACIAN OF GAUSSIAN
*******************************/

/**
 * Find the edges in an image using the Laplacian of Gaussian (Marr-Hildreth) operator
 *
 *
 * @param {number} kerSize - LoG kernel size
 * @param {number} sigma - Gaussian standard deviation
 *
 * @author Peter Bock
 */

const LoG = (kerSize=9,sigma=2.0) => (raster, copy_mode=true) =>
{
	let output = T.Raster.from(raster, copy_mode);
	output.type='uint8';
	output.pixelData = new Uint8ClampedArray(raster.length);
	const W = raster.width;
	let ker = logKernel(kerSize,sigma);
	let log_data = convolve(raster, ker);
	//threshold LoG output to 0
	let thr_img = log_data.map((x) => (x >= 0) ? x=0 : x=255); //set foreground and background according to the sign of the LoG
	let zero_cross=[];
	thr_img.forEach((px,i) =>
	{
		( (thr_img[i] === 255) && ( (thr_img[i%W-1+W*Math.floor(i/W -1)] === 0) || (thr_img[i%W+W*Math.floor(i/W -1)] === 0) || (thr_img[i%W+1+W*Math.floor(i/W -1)] === 0) || (thr_img[i%W-1+W*Math.floor(i/W)] === 0) || (thr_img[i%W+1+W*Math.floor(i/W)] === 0)  || (thr_img[i%W-1+W*Math.floor(i/W +1)] === 0) || (thr_img[i%W+W*Math.floor(i/W +1)] === 0) || (thr_img[i%W+1+W*Math.floor(i/W +1)] === 0) ) )  ? zero_cross.push(255) : zero_cross.push(0); ;
    //foreground point has at least one background neighbor so it is a zero-crossing.
	});

	output.pixelData = zero_cross;

    return output;
}

/******************************
CANNY ALGORITHM
*******************************/

/**
 * Performs non maximum suppression in 8-connectivity : pixels that are not the maximum value in their gradient direction are replaced by the lowest pixel value according to the image type
 *
 *
 * @param {number} W - Image width
 * @param {number} H - Image height
 * @param {array} grad - Gradient magnitude values of each pixel
 * @param {array} theta - Gradient orientation values of each pixel
 * @param {string} type - Image type
 *
 * @author Cecilia Ostertag
 */

const nonmax = (W, H, grad, theta, type) =>
{
	let valnull;
	(type === 'float32') ? valnull=-1 : valnull=0; //lowest value according to image type
	let newGrad=[]; //new grad values
	grad.forEach((val,i) =>
	{
			( ( (( i%W === 0) || (i%W === H-1) )  || ( (Math.floor(i/W) === 0) || (Math.floor(i/W) === H-1) ) ) ||

			( (theta[i] === 0) && ( (grad[i] <= grad[i-1]) || (grad[i] <= grad[i+1]) ) ) || //horizontal direction : compare with previous and next pixel

			( (theta[i] === 1) && ( (grad[i] <= grad[i%W-1+W*Math.floor(i/W + 1)]) || (grad[i] <= grad[i%W+1+W*Math.floor(i/W - 1)]) ) ) || //NE-SO direction : compare with previous and next pixel

			( (theta[i] === 2) && ( (grad[i] <= grad[i%W-1+W*Math.floor(i/W)]) || (grad[i] <= grad[i%W+1+W*Math.floor(i/W)]) ) ) || //vertical direction : compare with previous and next pixel

			( (theta[i] === 3) && ( (grad[i] <= grad[i%W-1+W*Math.floor(i/W - 1)]) || (grad[i] <= grad[i%W+1+W*Math.floor(i/W + 1)]) ) )  ) //NW-SE direction : compare with previous and next pixel

			? newGrad.push(valnull) : newGrad.push(grad[i]) ;
	});
    return newGrad;

}

/**
 * Performs hysteresis in 8-connectivity : first weak edge pixels next to strong edge pixels are kept, and then select non selected weak edge pixels  next to a strong edge pixel in several passes
 *
 *
 * @param {number} W - Image width
 * @param {array} strong_edges - Array in wich strong edges are represented by the number 2, and the others are represented by the number 0
 * @param {array} thresholded_edges - Array in wich strong edges are represented by the number 2, weak edges are represented by the number 1, and the others are represented by the number 0
 *
 * @author Cecilia Ostertag
 */

const hysteresis = (W, strong_edges, thresholded_edges) =>
{

	let edges=strong_edges.slice(); //final edge pixels
	let chosen_pixels=[];
	edges.forEach((val,i) =>
	{

		if ( (thresholded_edges[i] === 1) && ( (thresholded_edges[i%W-1+W*Math.floor(i/W-1)] === 2) || (thresholded_edges[i%W+W*Math.floor(i/W-1)] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W-1)] === 2) || (thresholded_edges[i%W-1+W*Math.floor(i/W)] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W)] === 2)  || (thresholded_edges[i%W-1+W*Math.floor(i/W+1)] === 2) || (thresholded_edges[i%W+W*Math.floor(i/W +1)] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W +1)] === 2) ) ) //weak edge is next to a strong edge (8-connectivity)
		{
			chosen_pixels.push(i); //we keep the pixel
			edges[i]=255;
		}

	});

	let i=0;
	//Extend strong edges based on current pixels, in several passes
	while (chosen_pixels.length > 0)
	{
		i++;
		let new_pixels=[];
		//select non selected weak edge pixels  next to a strong edge pixel (8 connectivity)
		chosen_pixels.forEach((i) =>
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
		});
		chosen_pixels=new_pixels;
	}

    return edges;
}

/**
 * Find edges in an image using Canny Algorithm
 *
 *
 * @param {number} low_thr - Low threshold for hysteresis
 * @param {number} high_thr - High threshold for hysteresis
 * @param {number} sigma - Standard deviation for the Gaussian blur
 *
 * @author Cecilia Ostertag
 */

const canny = (low_thr, high_thr, sigma=2.0) => (raster,copy_mode=true) =>
{
	let output = T.Raster.from(raster, copy_mode);
	output.type='uint8';
	output.pixelData = new Uint8ClampedArray(raster.length);
	if (raster.type === 'uint16')
	{
		low_thr*=256;
		high_thr*=256;
	}
	if (raster.type === 'float32')
	{
		low_thr=low_thr/128-1.0;
		high_thr=high_thr/128-1.0;
	}
	//console.log("gaussian filtering (9x9 kernel)");
	let data = convolve(raster, gaussianKernel(9,sigma));
	raster.pixelData = data;

	//console.log("compute gradient magnitude and orientation");
    Gx = convolve(raster, SOBEL_H);
    Gy = convolve(raster, SOBEL_V);
    let G = Gx.map((x,i) => Math.sqrt(Math.pow(Gx[i],2.0)+Math.pow(Gy[i],2.0)));
    let theta = Gx.map((x,i) => Math.atan2(Gy[i],Gx[i])); //get angle in rad and convert to degrees

	// we need to have 4 directions for theta : 0, 45, 90, 135
    theta = theta4directions(theta);


    //non-maximum suppression
    let newGrad = nonmax(raster.width, raster.height, G, theta, raster.type);

    //double threshold (we stop working on the gradient and start creating the binary edge
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
    let edges = hysteresis(raster.width, strong_edges, thresholded_edges);


	output.pixelData = edges;

    return output;
}

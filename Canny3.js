//Parameters:
//sigma (gaussian filter)

const low_thr=2.5;
const high_thr=7.5;

//Utility functions:
//function loadimg
const convert = function(image) //with greyscale image
{
	//get image data , only keep the first value for each pixel, return the new array
	const W = image.width;
	const H = image.height;
	let canvas = document.createElement("canvas"); //canvas for the image
	const ctx = canvas.getContext("2d"); 
	let img = ctx.getImageData(0,0,canvas.width,canvas.height);
	let data = img.data;
	
	let newData=[];
	for (var i=0; i<data.length; i+=4)
	{
		newData.push(data[i]);
	}
	
	return newData;
}


//function convolve (use twice)
const convolve = function(image, kernel,callback) //image is a HTMLImageElement
{
	const dim = Math.sqrt(kernel.length); //kernel dimension
	const pad = Math.floor(dim/2); //padding
	
	if (dim % 2 !== 1) {
        return callback(new RangeError("Invalid kernel dimension"), null);
    }
	
	const W = image.width;
	const H = image.height;
	let canvas = document.createElement("canvas"); //canvas for the image

	//add padding
	canvas.width = W+pad*2;
	canvas.height = H+pad*2;
	
	const ctx = canvas.getContext("2d"); 
	
	ctx.fillStyle = '#000'; // fill with opaque black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, pad, pad);

	//source image
	let img = ctx.getImageData(0,0,canvas.width,canvas.height);
	let data = img.data;

	//output image
	let newImg = ctx.createImageData(W,H);
	let newData = newImg.data;

	let row_idx, col_idx, ker_i, img_i, ker_row_idx, ker_col_idx, r, g, b;
	for (col_idx = pad; col_idx <= W; col_idx++)
	{
		for (row_idx = pad; row_idx <= H; row_idx++)
		{
			r = g = b = 0; // reset RGB values
			for (ker_col_idx = -pad; ker_col_idx <= pad; ker_col_idx++)
			{
				for (ker_row_idx= -pad; ker_row_idx <= pad; ker_row_idx ++)
				{
					ker_i = (ker_col_idx+pad)*dim + (ker_row_idx+pad); //kernel index to iterate through kernel col by col
					img_i = 4*((col_idx+ker_col_idx)*canvas.height + (row_idx + ker_row_idx)); // image index to iterate through portion of image (with pading) under kernel col by col , only get index of R value each time
					//console.log(img_i/4);
					r += data[img_i]*kernel[ker_i]; // R value
					g += data[++img_i]*kernel[ker_i]; // G value
					b += data[++img_i]*kernel[ker_i]; // B value
					
				}
			}
			
		newImg_i = 4*((col_idx - pad)*H + (row_idx - pad)); // pixel index in the output image (no padding)
		
		//TODO : why 0.5 ??
		newData[newImg_i] = (r + .5) ^ 0; // ^ = XOR operator
		newData[++newImg_i] = (g + .5) ^ 0;
		newData[++newImg_i] = (b + .5) ^ 0;
		newData[++newImg_i] = 255; //alpha value is 255 (opaque image)

		}

	}
	//console.log(newData);
	
	canvas.width = W;
    canvas.height = H;
 
    ctx.putImageData(newImg, 0, 0);
 
    let newImage = new Image();
 
    newImage.addEventListener('load', function () {
        callback(null, newImage);
    });
 
    newImage.addEventListener('error', function (error) {
        callback(error, null);
    });
 
    newImage.src = canvas.toDataURL('image/png');
    return newData;

}

//non-maximum suppression function
const nonmax = function(image,imageData, grad, theta) //image is a HTMLImageElement
{
	const W = image.width;
	const H = image.height;	
	
	let newGrad=grad.slice(); //new grad values

	let data = imageData;

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

//hysteresis function
const hysteresis = function(image,strong_edges, thresholded_edges) //image is a HTMLImageElement
{
	const W = image.width;
	const H = image.height;	
	
	let edges=strong_edges.slice(); //final edge pixels
	let pixels=[];

	let canvas = document.createElement("canvas"); //canvas for the image
	
	const ctx = canvas.getContext("2d"); 

	//source image
	let img = ctx.getImageData(0,0,canvas.width,canvas.height);
	let data = img.data;

	let i;
	for (i=1; i <= data.length-1; i++)
	{					
		if ( (thresholded_edges[i] === 1) && ( (thresholded_edges[i%W-1+W*Math.floor(i/W)-1] === 2) || (thresholded_edges[i%W+W*Math.floor(i/W)-1] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W)-1] === 2) || (thresholded_edges[i%W-1+W*Math.floor(i/W)] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W)] === 2)  || (thresholded_edges[i%W-1+W*Math.floor(i/W)+1] === 2) || (thresholded_edges[i%W+W*Math.floor(i/W)+1] === 2) || (thresholded_edges[i%W+1+W*Math.floor(i/W)+1] === 2) ) ) //weak edge is next to a strong edge (8-connectivity)
		{
			pixels.push(i); //we keep the pixel
			edges[i]=255;
		}	
	}
	
	//extend

    return edges;

}

//MAIN

let image = new Image();

console.log("loading image\n");

image.addEventListener('load', function () {
    image.alt = 'Player';
    document.body.appendChild(image);
    
    console.log("converting to 8bit image");
    imageData=convert(image);
    console.log(imageData);
    
    //TODO : gaussian filtering
    
    // horizontal sobel filter
	console.log("horizontal sobel");
    Convx = convolve(image,
             [-1, 0, 1,
              -2,0, 2,
              -1, 0, 1],
             function (error, result) {
                 if (error !== null) {
                     console.error(error);
                 } else {
                     result.alt = 'Boundary';
                     document.body.appendChild(result);
                 }
             }
    );
    
    // vertical sobel filter
	console.log("vertical sobel");
    Convy = convolve(image,
             [1, 2, 1,
              0,0, 0,
              -1, -2, -1],
             function (error, result) {
                 if (error !== null) {
                     console.error(error);
                 } else {
                     result.alt = 'Boundary';
                     document.body.appendChild(result);
                 }
             }
    );
    
    Gx=convert(Convx);
    Gy=convert(Convy);
    //gradient magnitude
    console.log("gadient magnitude");
    const G = Gx.map((x,i) => Math.sqrt(Math.pow(Gx[i],2.0)+Math.pow(Gy[i],2.0)));
    console.log(G);
    
    //orientation of intensity gradient vector
    console.log("intensity gradient");
    const theta = Gx.map((x,i) => Math.atan2(Gy[i],Gx[i])*(180/Math.PI)); //get angle in rad and convert to degrees
    console.log(theta);
    
    //non-maximum suppression
    console.log("non-maximum suppression");
    let newGrad = nonmax(image,imageData,G,theta);
    console.log(newGrad);
    
    //TODO : continue modifications : work on 8bit and only get back to 32bit before display
    
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
    }); 
    console.log(thresholded_edges); //undefined values ??
    
    //edge tracing with hysteresis : weak pixels near strong pixels
    console.log("hysteresis"); //on greyscale images (R=G=B=greyscale value)
    let edges = hysteresis(image,strong_edges,thresholded_edges);
    console.log(edges);
    
    //test
    const W = image.width;
	const H = image.height;
	let canvas = document.createElement("canvas"); //canvas for the image	
	const ctx = canvas.getContext("2d"); 
    
    let newImg = ctx.createImageData(W,H);
	let newData = newImg.data;
	
	for (var i=0; i<newData.length; i++)
	{
		
		newData[i]=newData[++i]=newData[++i]=edges[i];
		newData[++i]=255; //opaque image
	}
	
	canvas.width = W;
    canvas.height = H;
 
    ctx.putImageData(newImg, 0, 0);
 
    let newImage = new Image();
 
    newImage.addEventListener('load', function () {
        callback(null, newImage);
    });
 
    newImage.addEventListener('error', function (error) {
        callback(error, null);
    });
 
    newImage.src = canvas.toDataURL('image2/png');
    
    newImage.alt = 'Boundary';
    document.body.appendChild(newImage);
    
    
});

image.src = "/home/lyria/Desktop/Lenna8bit.jpg";

//5 steps :

//Noise suppression with Gaussian filter
//Init Gaussian filter (size 5x5 is classic) : see equation
//Convolve with image : see equation (do not forget padding)


//Hysteresis : only keep weak edge pixels conneted to a at least a strong edge pixel (8-connectivity)

"use strict"


//fonciton que j'ai trouvee qui permet de creer un element IMG dans le html et afficher une iamge dedans...

// possiblement peu utile...

function show_image(src, width, height, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;

    // This next line will just add it to the <body> tag
    document.body.appendChild(img);
}

//show_image('http://google.com/images/logo.gif',
//                 276,
//                 110,
//                 'Google Logo');

// TEST array (since we don't have the code for image loading/transformation yet)
let beforeArray = [[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3]];

// -----------------------------------------------------------------------------
// STEP 1: zero-padding step

// warning -> this only works for 3X3 kernels.

// I'm having enormous difficulties figuring out how to apply it so that we get the correct number of starting and ending zero
//arrays, if we specify a specific kernel size...
// I can modify it to eliminate the need for parArray2DEnds,
//to add as many 0 to the end of each subarray as needed depending on Kernel size too.
// problem is, I can't figure out how to functionally apply the padArray function
//with complete Zero arrays to the beginning and end of the ImageArray

// so as to have this:

// Kernel 3X3 -> 1 extra line of zeros at beginning and end
// Kernel 5X5 -> 2 extra lines of zeros at beginning and end.
// Etc.,

// my initial idea involved using padArray() a total of (Math.floor(KernelSize/2)) times,
//but I don't know how to repeat the function on the result of it's prior application an undefined number of times 
//HELP


// FUNCTIONAL: fonction ajoutant un zero avant et apres un array donnee
let padArray = subarray => [0].concat(subarray).concat(0);


// FUNCTIONAL: cree un array de 0 de la longueur de l'array donnee comme entree
let paddingArray = array => new Array(array.length).fill(0);
// FUNCTIONAL: pads the 2D array with an 0 array of the same length as it's internal arrays,
//at both ends of the 2D array.
// The use of an extra [] around the paddingArray function is because .concat()
//tries to recursively add each element of an array it is given as individual elemnts.
// but it doesn't do this recursively, so putting the array to append itself inside
//an array fixes the unwanted behaviour.
// FIX: this should probably be fixed in a "proper" way. this is a bit too "hacky" ?!?

let padArray2DEnds = array2D => [ paddingArray(array2D[0]) ].concat(array2D).concat([ paddingArray(array2D[0]) ]);

// FUNCTIONAL: applies padArray() to every internal array of a 2D array
let padInternalArrays = array2D => array2D.map(subarray => padArray(subarray));

// FUNCTIONAL: Complete image padding function, padding each internal array AND adding equal-length arrays of 0 to both ends.
// AKA., This function zero-pads the entire image.
let padImageArray = array2D => padInternalArrays(padArray2DEnds(array2D));

// APPLICATION:
let paddedBeforeArray = padImageArray(beforeArray);

let displayArray = paddedBeforeArray.join("\n"); // juste une meilleur affichage.

// Display the padded 2D array
alert(displayArray);



// -----------------------------------------------------------------------------

// convolution function

let paddedTestArray = padImageArray(beforeArray,3);

let testKernel = [[0,0,0],[0,1,0],[0,0,0]];

// AKA:
// 0 0 0
// 0 1 0
// 0 0 0

//
////              Kernel Function PseudoCode
//

//given that each subarray in our ImageArray is 1 line, 
//and that the number of subarrays in our kernel define how many lines it spans:


// we need an Y_Array "iterator" array with Num of the beginning and end line, <- 1 FunctA(kernelSize)
//of the length of the number of lines in our kernel.

// EX: [0,1,2] at the start, meaning first col, second col, third column

// an X_Array "iterator" array that spans the number of elements in one line of our kernel. <- 1 FunctA(kernelSize)

// Ex: [0,1,2] at the start, meaning first line, second line, third line

// each of these arrays are used as-is for 1 run of the kernel, 
//then assign the resulting value to the correct position in modified image array

// then X_Array++,
//                and re-run the kernel, untill x_Array gets to (lenImgArray - lenKernel)
// then Y_Array++,
//                begin with X_array at 0 again to (lenImgArray - lenKernel)...

// during 1 kernel run: <- 1 FunctB to create it ? or more ?

//kernel applies a calculation for each position (i)(j) taken from the 2 X and Y arrays.
// calculation is:
//   modifiedImageArray[i][j] = ImageArray[i][j] * kernel[indexOf(i,X_array)][indexOf(j,Y_array)]


// at the end, we should have a transformedImageArray corresponding to the application of the kernel every pixel of the TestArray.


// hmmm... can't think of more that's needed to complete the psuedo-code ?

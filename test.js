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
// I'm having enormous difficulties figuring out how to apply it so that we get the correct number of starting and ending zero arrays, if we specify a specific array size...



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

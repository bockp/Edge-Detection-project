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


let beforeArray = [[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3]];


// zero-padding step
// tres moche et horriblement mal organisee, mais je suis un peu fatigue...


// fonction ajoutant un zero avant et apres un array donnee
function padArray(arr,padding) {
  let paddedArr = arr.slice(0);
  paddedArr.push(padding);
  paddedArr.unshift(padding);
  return paddedArr;
}


// fonction ajoutant un array de 0 avant et apres les autres arrays de l'array 2D, avec la meme longueur.
//fait aussi le padding des arrays individuelles apres.
function padImage(arr){
  let imgArr = arr.slice(0);
  let padding = new Array(arr[0].length).fill(0);
  imgArr = padArray(imgArr,padding);
  imgArr = imgArr.map(subarray => padArray(subarray,0));
  return imgArr;
}

// voili voila, padding complete, qu'importe les dimensions de l'image (tant que les subarrays soient de taille identique...).
let paddedBeforeArray = padImage(beforeArray);


let x = paddedBeforeArray.join("\n"); // juste une meilleur affichage.

//display de la valeur
let message = "hello";
alert(x);


// convolution function

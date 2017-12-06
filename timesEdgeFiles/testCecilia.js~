/**
 * Display uint8 images
 */
let img0 = new T.Image('uint8',360,288); //360,288;
//try canny with lena1_px 100x100 (blured with gaussian blur sigma=1.0 with imageJ)
img0.setPixels(boats_pixels); //boats_pixels
let win0 = new T.Window('Boats');
let view0 = T.view(img0.getRaster());
// Create the window content from the view
win0.addView(view0);
// Add the window to the DOM and display it
win0.addToDOM('workspace');

let img2 = new T.Image('rgba',320,200);
img2.setPixels(clown_pixels);
let win2 = new T.Window('Clown');
let view2 = T.view(img2.getRaster());
// Create the window content from the view
win2.addView(view2);
// Add the window to the DOM and display it
win2.addToDOM('workspace');

let greyclown = to8bit(img2);
console.log(greyclown.raster.pixelData);

//console.log("data");
//console.log(img0.raster.pixelData);
let testCanny = canny(img2,50,60);
//console.log("end");
//console.log(newImg);
//let win = new T.Window('Boats Canny');
//let view = T.view(testCanny.getRaster());
// Create the window content from the view
//win.addView(view);
// Add the window to the DOM and display it
//win.addToDOM('workspace');


let testSobel = sobel(img2);
let testPrewitt = prewitt(img2);
let testRobert = robertscross(img2);
let testLoG = LoG(img2);

/*
let win1 = new T.Window('Boats Sobel');
let view1 = T.view(testSobel.getRaster());
// Create the window content from the view
win1.addView(view1);
// Add the window to the DOM and display it
win1.addToDOM('workspace');
let win2 = new T.Window('Boats Prewitt');
let view2 = T.view(testPrewitt.getRaster());
// Create the window content from the view
win2.addView(view2);
// Add the window to the DOM and display it
win2.addToDOM('workspace');
let win3 = new T.Window("Boats Robert's cross");
let view3 = T.view(testRobert.getRaster());
// Create the window content from the view
win3.addView(view3);
// Add the window to the DOM and display it
win3.addToDOM('workspace');

let win4 = new T.Window("Boats LoG");
let view4 = T.view(testLoG.getRaster());
// Create the window content from the view
win4.addView(view4);
// Add the window to the DOM and display it
win4.addToDOM('workspace');
let win5 = new T.Window("Grey clown");
let view5 = T.view(greyclown.getRaster());
// Create the window content from the view
win5.addView(view5);
// Add the window to the DOM and display it
win5.addToDOM('workspace');
*/
let win6 = new T.Window('Clown Canny');
let view6 = T.view(testCanny.getRaster());
// Create the window content from the view
win6.addView(view6);
// Add the window to the DOM and display it
win6.addToDOM('workspace');



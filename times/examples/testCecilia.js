/**
 * Display uint8 images
 */
let img0 = new T.Image('uint8',100,100); //360,288;
//lena1 was blured with gaussian blur sigma=1.0 with imageJ
img0.setPixels(lena1_px); //boats_pixels
let win0 = new T.Window('Boats');
let view0 = T.view(img0.getRaster());
// Create the window content from the view
win0.addView(view0);
// Add the window to the DOM and display it
win0.addToDOM('workspace');

//console.log("data");
//console.log(img0.raster.pixelData);
let testCanny = canny(img0,5,30);
//console.log("end");
//console.log(newImg);
let win = new T.Window('Boats Canny');
let view = T.view(testCanny.getRaster());
// Create the window content from the view
win.addView(view);
// Add the window to the DOM and display it
win.addToDOM('workspace');

/*
let testSobel = sobel(img0);
let testPrewitt = prewitt(img0);


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
*/

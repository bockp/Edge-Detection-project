/**
 * Display uint8, uint16, and float32 images
 */
let img0 = new T.Image('uint16',256,256); //360,288;
let uint16_lena = lenna_256x256.map ( (px) => px * 256);
let float_lena = lenna_256x256.map( (px) => px/128 - 1.0);
//to change the type of images, change the value in setPixels, and do not forget to change the type of img0
img0.setPixels(uint16_lena);
console.log("length",float_lena.length);
let win0 = new T.Window('Lena');
let view0 = T.view(img0.getRaster());
// Create the window content from the view
win0.addView(view0);
// Add the window to the DOM and display it
win0.addToDOM('workspace');

let testSobel = sobel(img0);
let testPrewitt = prewitt(img0);
let testRobert = robertscross(img0);
let testLoG = LoG(img0,1.4); // 2.0 works great with the float32 image !!
let testCanny = canny(img0,15.0,30.0,2.0); // 50.0,170.0 works with float32 images


let win1 = new T.Window('Test Sobel');
let view1 = T.view(testSobel.getRaster());
// Create the window content from the view
win1.addView(view1);
// Add the window to the DOM and display it
win1.addToDOM('workspace');
let win2 = new T.Window('Test Prewitt');
let view2 = T.view(testPrewitt.getRaster());
// Create the window content from the view
win2.addView(view2);
// Add the window to the DOM and display it
win2.addToDOM('workspace');
let win3 = new T.Window("Test Robert's cross");
let view3 = T.view(testRobert.getRaster());
// Create the window content from the view
win3.addView(view3);
// Add the window to the DOM and display it
win3.addToDOM('workspace');

let win4 = new T.Window("Test Canny");
let view4 = T.view(testCanny.getRaster());
// Create the window content from the view
win4.addView(view4);
// Add the window to the DOM and display it
win4.addToDOM('workspace');

let win6 = new T.Window('Test LoG');
let view6 = T.view(testLoG.getRaster());
// Create the window content from the view
win6.addView(view6);
// Add the window to the DOM and display it
win6.addToDOM('workspace');


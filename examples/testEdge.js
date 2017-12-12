/**
 * Display uint8, uint16, and float32 images
 */

let uint8_lena = lenna_256x256;
let uint16_lena = lenna_256x256.map ( (px) => px * 256);
let float_lena = lenna_256x256.map( (px) => px/128 - 1.0);
 
let type = 'uint8';
let pixels = uint8_lena;
 
let img1 = new T.Image(type,256,256);
//to change the type of images, change the value in setPixels, and do not forget to change the type of img0
img1.setPixels(pixels);
let win0 = new T.Window('Lena');
let view0 = T.view(img1.getRaster());
// Create the window content from the view
win0.addView(view0);
// Add the window to the DOM and display it
win0.addToDOM('workspace');

let img2 = new T.Image(type,256,256);
img2.setPixels(pixels);
let img3 = new T.Image(type,256,256);
img3.setPixels(pixels);
let img4 = new T.Image(type,256,256);
img4.setPixels(pixels);
let img5 = new T.Image(type,256,256);
img5.setPixels(pixels);

let workflowSobel = T.pipe(sobel(),T.view);
let view1 = workflowSobel(img1.getRaster());
let workflowPrewitt = T.pipe(prewitt(),T.view);
let view2 = workflowPrewitt(img2.getRaster());
let workflowRobert = T.pipe(robertscross(),T.view);
let view3 = workflowRobert(img3.getRaster());
let workflowLoG = T.pipe(LoG(9,1.4),T.view); // sigma=2.0 works great with the float32 Lena image !!
let view4 = workflowLoG(img4.getRaster()); // 50.0,170.0 works with float32 Lena image
let workflowCanny = T.pipe(canny(15.0,30.0,2.0),T.view);
let view5 = workflowCanny(img5.getRaster());


let win1 = new T.Window('Test Sobel');
win1.addView(view1);
win1.addToDOM('workspace');

let win2 = new T.Window('Test Prewitt');
win2.addView(view2);
win2.addToDOM('workspace');

let win3 = new T.Window("Test Robert's cross");
win3.addView(view3);
win3.addToDOM('workspace');

let win4 = new T.Window("Test LoG");
win4.addView(view4);
win4.addToDOM('workspace');

let win5 = new T.Window('Test Canny');
win5.addView(view5);
win5.addToDOM('workspace');


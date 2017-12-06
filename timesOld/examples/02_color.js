/**
 * Calculates statistics of image boats.gif
 */


let img = new T.Image('rgba',320,200);
img.setPixels(clown_pixels);

console.log(img instanceof T.Image);
console.log(T.hue(0xff0a20ff));

// Process
let nChannels = 9;

let workflow = T.pipe(
T.splitChannels(T.red,T.green,T.blue, T.hue, T.saturation, T.value,T.luminance, T.chrominanceRed, T.chrominanceBlue),
T.montage(3,3)
);

// Run the pipe and put the resulting view in the variable view
let view = workflow(img.raster);

// Render
let win = new T.Window('Clown montage');

// Create the window content from the view
win.addView(view);
// Add the window to the DOM and display it
win.addToDOM('workspace');

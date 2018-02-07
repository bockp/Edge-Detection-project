let uint8_lena = lenna_256x256;
let uint16_lena = lenna_256x256.map ( (px) => px * 256);
let float_lena = lenna_256x256.map( (px) => px/128 - 1.0);
 
let type = 'uint8';
let pix = uint8_lena;

let img = new T.Image(type,256,256);
img.setPixels(new Uint8Array(uint8_lena));

let gpuEnv = gpu.getGraphicsContext("preview");

gpuDisplay(img.getRaster(),gpuEnv);

let img3 = new T.Image(type,256,256);
img3.setPixels(new Uint8Array(pix));

let gpuEnv3 = gpu.getGraphicsContext("preview2");
gpuEdgeCanny(50.0,100.0)(img3.getRaster(),gpuEnv3);


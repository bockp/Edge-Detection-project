let uint8_lena = lenna_256x256;
let uint16_lena = lenna_256x256.map ( (px) => px * 256);
let float_lena = lenna_256x256.map( (px) => px/256 );

//let type = 'uint16';
//let pix = uint16_lena;
let W = 256;
let H = 256;
//128-105 , 300-246 , 512-420 , 1024-840 , 2048-1679, 4096-3360
let img = new T.Image('uint8',W,H);
img.setPixels(new Uint8Array(uint8_lena));
let gpuEnv = gpu.getGraphicsContext("preview");
gpuDisplay(img.getRaster(),gpuEnv);

let img1 = new T.Image('uint8',W,H);
img1.setPixels(new Uint8Array(uint8_lena));
let gpuEnv1 = gpu.getGraphicsContext("preview1");
gpuEdgeCanny(50.0,100.0)(img1.getRaster(),gpuEnv1);

let img2 = new T.Image('uint16',W,H);
img2.setPixels(new Uint16Array(uint16_lena));
let gpuEnv2 = gpu.getGraphicsContext("preview2");
gpuEdgeCanny(50.0,100.0)(img2.getRaster(),gpuEnv2);

let img3 = new T.Image('float32',W,H);
img3.setPixels(new Float32Array(float_lena));
let gpuEnv3 = gpu.getGraphicsContext("preview3");
gpuEdgeCanny(50.0,100.0)(img3.getRaster(),gpuEnv3);


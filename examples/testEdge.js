let uint8_lena = lenna_256x256;
let uint16_lena = lenna_256x256.map ( (px) => px * 256);
let float_lena = lenna_256x256.map( (px) => px/256 );

let W = 256;
let H = 256;
let img = new T.Image('uint8',W,H);
img.setPixels(new Uint8Array(uint8_lena));
let gpuEnv = gpu.getGraphicsContext("preview");
gpuDisplay(img.getRaster(),gpuEnv);



let img1S = new T.Image('uint8',W,H);
img1S.setPixels(new Uint8Array(uint8_lena));
let gpuEnv1S = gpu.getGraphicsContext("preview1S");
gpuEdgeSobel()(img1S.getRaster(),gpuEnv1S);

let img2S = new T.Image('uint16',W,H);
img2S.setPixels(new Uint16Array(uint16_lena));
let gpuEnv2S = gpu.getGraphicsContext("preview2S");
gpuEdgeSobel()(img2S.getRaster(),gpuEnv2S);

let img3S = new T.Image('float32',W,H);
img3S.setPixels(new Float32Array(float_lena));
let gpuEnv3S = gpu.getGraphicsContext("preview3S");
gpuEdgeSobel()(img3S.getRaster(),gpuEnv3S);



let img1P = new T.Image('uint8',W,H);
img1P.setPixels(new Uint8Array(uint8_lena));
let gpuEnv1P = gpu.getGraphicsContext("preview1P");
gpuEdgePrewitt()(img1P.getRaster(),gpuEnv1P);

let img2P = new T.Image('uint16',W,H);
img2P.setPixels(new Uint16Array(uint16_lena));
let gpuEnv2P = gpu.getGraphicsContext("preview2P");
gpuEdgePrewitt()(img2P.getRaster(),gpuEnv2P);

let img3P = new T.Image('float32',W,H);
img3P.setPixels(new Float32Array(float_lena));
let gpuEnv3P = gpu.getGraphicsContext("preview3P");
gpuEdgePrewitt()(img3P.getRaster(),gpuEnv3P);



let img1R = new T.Image('uint8',W,H);
img1R.setPixels(new Uint8Array(uint8_lena));
let gpuEnv1R = gpu.getGraphicsContext("preview1R");
gpuEdgeRobert()(img1R.getRaster(),gpuEnv1R);

let img2R = new T.Image('uint16',W,H);
img2R.setPixels(new Uint16Array(uint16_lena));
let gpuEnv2R = gpu.getGraphicsContext("preview2R");
gpuEdgeRobert()(img2R.getRaster(),gpuEnv2R);

let img3R = new T.Image('float32',W,H);
img3R.setPixels(new Float32Array(float_lena));
let gpuEnv3R = gpu.getGraphicsContext("preview3R");
gpuEdgeRobert()(img3R.getRaster(),gpuEnv3R);

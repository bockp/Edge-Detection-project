let img = new T.Image('uint8',360,288);
img.setPixels(new Uint8Array(boats_pixels));

let gpuEnv = gpu.getGraphicsContext("preview");

gpuDisplay(img.getRaster(),gpuEnv);

let img2 = new T.Image('uint8',360,288);
img2.setPixels(new Uint8Array(boats_pixels));

let gpuEnv2 = gpu.getGraphicsContext("preview2");

gpuGaussBlur3x3(img2.getRaster(),gpuEnv2);

let img3 = new T.Image('uint8',360,288);
img3.setPixels(new Uint8Array(boats_pixels));

let gpuEnv3 = gpu.getGraphicsContext("preview3");

gpuGaussBlur5x5(img3.getRaster(),gpuEnv3);

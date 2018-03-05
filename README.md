
To use the complete set of Image Processing functions in your browser, head on over to [our teacher's TIMES project](https://github.com/crazybiocomputing/times), which integrates the different algorithms developed by us and the rest of our colleagues from the [Bioinformatics Master degree of Bordeaux](http://master-bioinfo-bordeaux.github.io/).

---------------

To use, clone first crazybiocomputing/times repository on your computer, then in the same directory clone this repository.

# Edge detection functions with WEBGL 2:
In src/gpu : display.js : basic display of an image , canny.js : gpuEdgeCanny function (Canny edge detector) 

In examples : testCanny.js and testCanny.html : example of Canny edge detector, benchmarkForTijiGPU.js : benchmark function to test Canny GPU implementation, STILL BUG WITH 16bit IMAGES


[Example of Canny, 8bit, 16bit, float32](https://rawgit.com/bockp/Edge-Detection-project/master/examples/testCanny.html)

[Example of Sobel, Prewitt, Robert's cross](https://rawgit.com/bockp/Edge-Detection-project/master/examples/testEdge.html)

Benchmark files for CPU : branch cpu, main folder

Benchmark files for GPU : branch master, examples folder

Benchmark file for ImageJ : branch master, main folder

# Edge detection functions with ES6 (see cpu branch):

All of our functions are in src/process/edgeDetect.js .

To test our results, you can use the file examples/testEdge.js, using a 256x256 uint8 version of Lena as input for our five functions : *sobel()*, *prewitt()*, *robertscross()*, *LoG()*, and *canny()*.

[Examples](https://rawgit.com/bockp/Edge-Detection-project/cpu/examples/testEdge.html)

# Tiny Image in Javascript (TIJ) project

Each group of three students must choose a subject among this list:

*  Analyze: Analyze Particles (as in ImageJ)
*  Edge: Edge Detection: Sobel, Laplace, Canny, etc.
*  FilterLin: Filters 2D (linear filter): Convolve, Mean, Gaussian Blur, etc.
*  FilterRank: Filters 2D (rank filters): Median, Min, Max, Variance
*  FFT: Fourier Transform + Correlation
*  Hough: Hough Transform : Line and Circle detection
*  Threshold: Thresholding methods: by hand, automatic: Otsu, etc. (as in ImageJ).
*  Morpho: Mathematical Morphology: dilate, erode, open, close, Hit or Miss, skeletonize, EDM, UEP with structuring element (plugin ImageJ).
*  Contrast: 'Adjust > Brighntess and Contrast' and 'Enhance Contrast' operations of ImageJ with Normalize and Equalize.


# Our Subject -> Edge Detection: Sobel, Laplace, Canny, etc.

The aim of this project is to develop one or more image processing features in a classical image toolbox.
The project is separated into 3 segments:

## Literature search on the different algorithms and their implementation in ImageJ + benchmarking in ImageJ

 First month is focused on literature research and presentating the different algorithms, along with the various optimizations available.

For us it would be presenting all *Edge Detection algorithms available in ImageJ*, be it by default or plugins.

Benchmarking is needed to compare the efficiency and effectiveness of these algorithms.
We will use this benchmarking to study how efficient each algorithm seems at detecting edges (both real and false positives), and what is sacrificed to achieve better results.

## Development of one or more of the Edge Detectors in JS/ECMA 6 + benchmarking and comparison with previous benchmark.

Second month consists of the development of one or more functions in Javascript — the latest version will be used, ECMAScript 2015 or ECMAScript 6 — using the **functional programming paradigm**.


Only, Mozilla Firefox and Google Chrome will be used as testing platforms for the JS code.

node.js will *not* be used in this project because the program architecture is not the same. Moreover, we would need the latest version — version 8 — to support ECMAScript 2015.


The JS code must follow — as much as possible — the style guidelines of AirBnB available in [github.io](https://github.com/airbnb/javascript).

Workload distribution:

Cecilia Ostertag : Canny operator

Ophelie Thierry  : Sobel/Prewitt/Cross operators

Peter Bock       : Laplacian of Gaussian operator

## Implementation of the *same functions as above* using the *WebGL library* + benchmarking and comparison with previous benchmarks.

Third month is dedicated to the implementation of the same functions using WebGL library, and benchmarking to study if such an implementation improves the performance of the algorithms compared to the previous months implementations.

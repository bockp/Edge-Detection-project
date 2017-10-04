# TODO :
* peer-review algorithm descriptions.
* Finish explanations of Canny algorithm.
* ~~Find info on the complexities of the algorithms if possible~~ couldn't find concrete information.
* Conclusion.
* PROOFREAD 'TILL WE DIE

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

Second month consists of the development of one or more functions in vanilla Javascript — the latest version will be used, ECMAScript 2015 or ECMAScript 6 — using the *functional programming paradigm*.


Only, Mozilla Firefox and Google Chrome will be used as testing platforms for the JS code.

node.js will *not* be used in this project because the program architecture is not the same. Moreover, we would need the latest version — version 8 — to support ECMAScript 2015.


The JS code must follow — as much as possible — the style guidelines of AirBnB available in [github.io](https://github.com/airbnb/javascript).


## Implementation of the *same functions as above* using the *WebGL library* + benchmarking and comparison with previous benchmarks.

Third month is dedicated to the implementation of the same functions using WebGL library, and benchmarking to study if such an implementation improves the performance of the algorithms compared to the previous months implementations.

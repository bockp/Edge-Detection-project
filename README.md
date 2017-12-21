

* Pour utiliser le repertoire crazybiocomputing/Times distant dans un git local, faites le clone initiale comme ceci:

 git clone --recursive <project url>

ou faites, dans un git local existant:

git submodule update --init --recursive

Sinon le submodule crazybiocomputing/times sera vide sur vos ordis.

# To do:

- [ ] describe the parameters of each functions for the benchmark (in the materials and methods part, look at the benchmark.js and benchmarkForTiji.js for the values of the parameters, values chosen because they give similar visual results)
- [ ] benchmark for uint16 and float32 images for our functions - I'm on it (Cecilia)
- [ ] write properly the discussion, I have written basically what we need to say but we need to write it better
- [ ] add name of the authors of the imageJ plugins (see previous report)
- [ ] describe briefly the utility functions (basically what is written in the documentation of each function)
- [x] add ref for Robert's cross in the introduction (at the same lace as sobel prewitt and kirch)
- [ ] add the whatever to set up properly the size of the images for the convertion to pdf
- [ ] check that all the code is still working well !!
- [ ] Check no comments remain in edge2.md
- [ ] check the PDF is properly generated with pandoc
- [ ] send report to Taveau if everything is in order.

- [ ] Joke: send report to Taveau for Christmas (Yes, I know you read the githubs from timle to time, sir ;) )

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

Peter Bock       : LaPlace operators


if time (and motivation) allows:

* Kirsch, 

## Implementation of the *same functions as above* using the *WebGL library* + benchmarking and comparison with previous benchmarks.

Third month is dedicated to the implementation of the same functions using WebGL library, and benchmarking to study if such an implementation improves the performance of the algorithms compared to the previous months implementations.

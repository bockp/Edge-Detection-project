# Tiny Image in Javascript (TIJ) project
# Edge Detection: Sobel, Laplace, Canny, etc.

The aim of this project is to develop one or more image processing features in a classical image toolbox.
The project is separated into 3 segments:

## Literature search on the different algorithms and their implementation in ImageJ + benchmarking in ImageJ

 First month is focused on literature research and presentating the different algorithms, along with the various optimizations available.

For us it would be presenting all *Edge Detection algorithms available in ImageJ*, be it by default or plugins (**or just by default ? we need to ask Taveau which algorithms we're supposed to work on, given the "etc." in the subject title**)

Benchmarking is also needed, though after what Taveau said it's mainly an *improvised* benchmarking system for the first month.
**AKA., If we make a JS script that runs the algorithm for the different edge detection schemes on the same image, how much time, ressources, etc... does it take for each to run ? how correct were they ? does it depend on the kind of image ?**
I found an article that might provide hints here: https://doi.org/10.1016/0146-664X(82)90070-3


## Development of one or more of the Edge Detectors in JS/ECMA 6 + benchmarking and comparison with previous benchmark.

Second month consists of the development of one or more functions in vanilla JavaScript — the latest version will be used, ECMAScript 2015 or ECMAScript 6 — using the *functional programming paradigm*.


Only, Mozilla Firefox and Google Chrome will be used as testing platforms for the JS code.

node.js will *not* be used in this project because the program architecture is not the same. Moreover, we would need the latest version — version 8 — to support ECMAScript 2015.


The JS code must follow — as much as possible — the style guidelines of AirBnB available in [github.io](https://github.com/airbnb/javascript).


## Implementation of the *same functions as above* using the *WebGL library* + benchmarking and comparison with previous benchmarks.

Third month is dedicated to the implementation of the same functions but using WebGL library. 






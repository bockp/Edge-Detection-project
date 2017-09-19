# 1.Introduction





ImageJ[0]
* *talk about the importance of image analysis and creating efficient tools for it.*
* *Introduce the general information on the project (name, main goal, 3 steps)*
* *Talk about our part (edge detection) and what kinds odf edge detection exist (1. simple derivative max finding 2. secondary derivative Zero finding 3.?)*

"An edge can generally be defined as a boundary or contour that separates adjacent image regions having relatively distinct characteristics according to some features of interest. Most often this feature is gray level or luminance”[*??quel ref*]  According to this definition, the pixels of an image belonging to an edge are the pixels located in regions of abrupt gray level changes. Moreover, to avoid counting noise pixels as edges, the pixels have to be part of a contour-like structure.
Edge detection is the process of finding the pixels belonging to the edges in an image, and producing a binary image showing the locations of the edge pixels. The derivative or the gradient of the grey level intensity can be used to detect edges, as abrupt intensity changes translates to local extrema in the 1st derivative (Sobel approach), and to a zero-crossing in the 2nd derivative (Laplacian approach).

![Different views of a 1D edge in derivatives](https://github.com/bockp/Edge-Detection-project/blob/master/derivatives.jpg)

Edge detectors based on the derivative are sensitive to noise, which lead to the development of several algorithms. Most of them use a filter to reduce noise before actually detecting edges in the image.[*ref article disant cela*]
Errors in edge detection can be either false positives (classification of non edge pixels as edge pixels) or false negatives (classification of edge pixels as non-edge pixels). There is also a conflict between the correct detection of edges and the precise localization of their position. 

Edge detection algorithms usually have three main steps[*ref*]:
- smoothing: filtering to suppress noise.
- differentiation: to amplify the edges.
- decision: detection of edges using 1st or 2nd derivatives combined with thresholding.

Linear edge operators :
- Convolution with edge templates (Prewit, Sobel, Kirsh)
- Zero-crossings of LoG convolution
- Zero-crossings of directional derivatives of smoothed images (Canny)

In our project, we shall begin by documenting the 3 main linear edge detection algorithms in ImageJ.
Then, we will create our own implementations of these algorithms using Ecmascript 6 [*ref Ecmascript6*] and a common Javascript enabled web browser so as to be able to do edge detection in images without relying upon ImageJ.
Finally, we will implement these algorithms using WebGL[*ref WebGL*] so as to take advantage of the processing power of the GPU *??c'est pour ca, non??*.
Each step (ImageJ, Ecmascript and WebGL implementations) will be benchmarked[bench] so as to study the advantages of the different algorithms, and the efficiency of the different implementations.


# 2.Material & Methods

* *description of the main algorithms and their implementation in ImageJ.*

## Sobel

The Sobel Operator, introduced in a presentation at the Standford A.I Project in 1968 by Irwin Sobel[1], is the default algorithm implemented in ImageJ for the Find Edges function, and is considered one of the simplest functional Edge Detection algorithms out there.



## Canny

## Laplace


# 3.Results

* *examples of the image processing and a benchmark of the features of the different algorithms.*


# 4.Discussion

* *comparison of benchmarks of different implementations, ways to improve them (probably more towards the second month)*

# 5.Conclusion


# References
Introduction:

[0]:Schindelin, J.; Rueden, C. T. & Hiner, M. C. et al. (2015), ["The ImageJ ecosystem: An open platform for biomedical image analysis"](http://onlinelibrary.wiley.com/doi/10.1002/mrd.22489/full), Molecular Reproduction and Development, PMID 26153368 

Sobel:
[1] Sobel, Irwin. (2014). An Isotropic 3X3 Image Gradient Operator. Presentation at Stanford A.I. Project 1968.













* ***NO websites***

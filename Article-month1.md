# 1.Introduction

Image processing is one of the most important fields in the domain of computer vision[Bovik]. Indeed, nearly every branch of science has a subdiscipline dedicated to retrieving information from the world, nearly always through the use of recording devices storing that information in the form of discrete images or videos.
For a computer to make sense of these images, it needs to be able to interprete them, understand them.
That is where Image Processing comes in, allowing a computer to process an image and detect its major features, and to perform higher-level vision tasks like face recognition.
In our project, we will examine one specific field of image processing : edge detection.

The physical notion of edge comes from the shape of three dimensional objects or by their material properties. Obviously, as the aquisition process transaltes 3D scenes to 2D representations, this definition does not apply to image processing. In this report we will use the following definition : "An edge can generally be defined as a boundary or contour that separates adjacent image regions having relatively distinct characteristics according to some features of interest. Most often this feature is gray level or luminance”[Bovik]. According to this definition, the pixels of an image belonging to an edge are the pixels located in regions of abrupt gray level changes. Moreover, to avoid counting noise pixels as edges, the pixels have to be part of a contour-like structure.
Edge detection is the process of finding the pixels belonging to the edges in an image, and producing a binary image showing the locations of the edge pixels. The derivative or the gradient of the grey level intensity can be used to detect edges, as abrupt intensity changes translates to local extrema in the 1st derivative (Sobel approach), and to a zero-crossing in the 2nd derivative (Laplacian approach).

Edge detectors based on the derivative are sensitive to noise, which lead to the development of several algorithms. Most of them use a filter to reduce noise before actually detecting edges in the image.[Bovik]
These algorithms usually have three main steps:
- smoothing: use of a filter to suppress the noise.
- differentiation: amplification of the edges in the image
- decision: detection of edges using 1st or 2nd derivatives usually combined with thresholding.

Errors in edge detection can be either false positives (classification of non edge pixels as edge pixels) or false negatives (classification of edge pixels as non-edge pixels). There is also a conflict between the correct detection of edges and the precise localization of their position. 

In our project, we shall begin by documenting the 3 main linear edge detection approaches and algorithms in ImageJ[imagej]:
- Convolution with edge templates (Prewit, Sobel, Kirsh)[refs ?]
- Zero-crossings of Laplacian of Gaussian convolution [ref?]
- Zero-crossings of directional derivatives of smoothed images (Canny)[ref]

*Est-ce qu'on doit parler de la suite de notre projet dans ce premier rapport ??*

Then, we will create our own implementations of these algorithms using Ecmascript 6 [ecmascript] and a common Javascript enabled web browser so as to be able to do edge detection in images without relying upon ImageJ.
Finally, we will implement these algorithms using WebGL[WebGL] so as to take advantage of the processing power of the GPU *??c'est pour ca, non??*.
Each step (ImageJ, Ecmascript and WebGL implementations) will be benchmarked[benchmark] so as to study the advantages of the different algorithms, and the efficiency of the different implementations.


# 2.Material & Methods

* *description of the main algorithms and their implementation in ImageJ. A pacer dans l'ordre chronologique de préférence*

![Fig1](https://github.com/bockp/Edge-Detection-project/blob/master/derivatives.jpg)
**hhh**

## Sobel

The Sobel Operator, introduced in a presentation at the Standford A.I Project in 1968 by Irwin Sobel[sobel], is the default algorithm implemented in ImageJ for the Find Edges function, and is considered one of the simplest functional Edge Detection algorithms out there.

It works by using a filter mask to look for local maxima and minima in the first derivative of the image.
it uses two masks, one horizontal and one vertical (Fig2)

![http://aishack.in/tutorials/sobel-laplacian-edge-detectors/](https://github.com/bockp/Edge-Detection-project/blob/master/sobel-kernels1.jpg)

**to be completed**
* **include images of both filter results and combined density map**
* **finish describing algorithm and link to annex with the ImageJ implementation**

## Canny


## Laplacian based methods (Laplacian of Gaussian, Marr-Hidreth Filter):

*formulas described in Bovik... to be inserted to illustate each step*

The Laplacian is a 2D isotropic measure of the 2nd spatial derivative (*formula*). It is used to detect regions of rapid intensity change in an image :
- In the regions of constant intensity (intensity gradient equal to zero), the Laplacian is equal to zero. (*formula*)
- In regions where there is a change in intensity, the Laplacian is positive on the darker side, and negative on the lighter side. (*formula*)
This has the effect of highlighting the edges in the image, and can be used as an enhancement technique, by adding the filtered image to the original image. 

The Laplacian operator is usually used on greylevel images, previously smoothed with a Gaussian filter to reduce noise.
It is also possible to convolve the Gaussian smoothing filter with the Laplacian filter, before convolving this Laplacian of Gaussian (LoG) with the image. (*formula*) The Gaussian and Laplacian kernels are both small so it requires fewer operations than using both filters on the image. Another advantage of the LoG is that it can be calculated in advance as it is independent of the image to process. It is important to note that the result of these edge detectors is highly influenced by the standard deviation used for the Gaussian filter chosen for the smoothing step. 

It is not possible to extract directly the edge orientation information from the Laplacian output. To extract the edges, we need to detect the zero-crossings in the output of the Laplacian (or the LoG), i.e. the regions of the image where the Laplacian passes through zero. However this can also happen in regions that are features other than edges in the image and can be the cause of false positives.
The input of the zero-crossing detector is the LoG filtered image, and the output is a binary image with lines representing the positions of all the zero-crossing points. All of the contour lines are closed lines because the strength of the edge is not considered so even gradual intensity transitions result in a zero-crossing. As we said previously, local minima of the gradient magnitude can cause false edges, that can be eliminated by using a threshold for edge strength, causing breaks in the closed contours.

In ImageJ, two plugins provide an implementation of the LoG operator :
- The Laplacian plugin of FeatureJ package  (*j'ai un lien : https://imagescience.org/meijering/software/featurej/laplacian/ mais pas de publi associée...*)
This plugin is based on ImageScience, a java library for image processing (*pareil : https://imagescience.org/meijering/software/imagescience/ *) which provides tools for computing the LoG of an image and detecting the zero-crossings. The only parameter accessible to the user is the "laplacian smoothing scale", meaning the standard deviation used for the Gaussian kernel.
(*résumé rapide du workflow de l'algorithme*)
- The LoG_Filter plugin (*https://imagej.nih.gov/ij/plugins/log-filter.html*).
This plugin is a standalone and provides more parameters to the user : sigma


# 3.Results

* *examples of the image processing and a benchmark of the features of the different algorithms.*


# 4.Discussion

* *comparison of benchmarks of different implementations, ways to improve them (probably more towards the second month)*

# 5.Conclusion


# References

[bovik] Bovik, Alan C., ed. The essential guide to image processing. Academic Press, 2009.

[*??quel ref*] 

[*ref article disant cela*]


[imagej] : Schindelin, J.; Rueden, C. T. & Hiner, M. C. et al. (2015), ["The ImageJ ecosystem: An open platform for biomedical image analysis"](http://onlinelibrary.wiley.com/doi/10.1002/mrd.22489/full), Molecular Reproduction and Development, PMID 26153368 

[ecmascript] ECMAScript, E. C. M. A., and European Computer Manufacturers Association. "Ecmascript language specification." (2011).

[WebGL] Marrin, Chris. "Webgl specification." Khronos WebGL Working Group (2011).

[benchmark] McNair, Carol Jean, and Kathleen HJ Leibfried. Benchmarking: A tool for continuous improvement. John Wiley & sons, 1992.

[sobel] Sobel, Irwin. (2014). An Isotropic 3X3 Image Gradient Operator. Presentation at Stanford A.I. Project 1968.


# to place

refs :19, 15, 13, 4
19 : Theory of edge detection (1980) : accessible
15 : On the discrete representation of the Laplacian of Gaussian (1999) 
13 : Comparison of edge detectors, a methodology and initial study (1998) : payant
4 : Edge detector evaluation using empirical ROC curves (2001) : payant

math equations in “The essential guide to image processing , chap 19”

Simple algorithms using Java : http://homepages.inf.ed.ac.uk/rbf/HIPR2/flatjavasrc/ZeroCrossing.java (LoG)
http://homepages.inf.ed.ac.uk/rbf/HIPR2/flatjavasrc/Canny.java
http://homepages.inf.ed.ac.uk/rbf/HIPR2/flatjavasrc/Sobel.java


* ***NO websites***

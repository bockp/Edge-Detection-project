# 1.Introduction

Image processing is one of the most important fields in the domain of computer vision[Bovik]. indeed, nearly every branch of science has a subdiscipline dedicated to retrieving information from the world, nearly always throught the use of recording devices storing that information in the form of discrete images or videos.
For a computer to make sense of these images, it needs to be able to interprete them, understand them.
That is where Image Processing comes in, allowing a computer to process an image and detect it's major features, and to perform higher-level vision tasks like face recognition.
In our project, we will examine one specific kind of image processing, Edge Detection.

*partie intro Cecilia*

"An edge can generally be defined as a boundary or contour that separates adjacent image regions having relatively distinct characteristics according to some features of interest. Most often this feature is gray level or luminance”[*??quel ref*]  According to this definition, the pixels of an image belonging to an edge are the pixels located in regions of abrupt gray level changes. Moreover, to avoid counting noise pixels as edges, the pixels have to be part of a contour-like structure.
Edge detection is the process of finding the pixels belonging to the edges in an image, and producing a binary image showing the locations of the edge pixels. The derivative or the gradient of the grey level intensity can be used to detect edges, as abrupt intensity changes translates to local extrema in the 1st derivative (Sobel approach), and to a zero-crossing in the 2nd derivative (Laplacian approach).

![Fig1](https://github.com/bockp/Edge-Detection-project/blob/master/derivatives.jpg)

Edge detectors based on the derivative are sensitive to noise, which lead to the development of several algorithms. Most of them use a filter to reduce noise before actually detecting edges in the image.[*ref article disant cela*]
Errors in edge detection can be either false positives (classification of non edge pixels as edge pixels) or false negatives (classification of edge pixels as non-edge pixels). There is also a conflict between the correct detection of edges and the precise localization of their position. 

Edge detection algorithms usually have three main steps[bovik]:
- smoothing: filtering to suppress noise.
- differentiation: to amplify the edges.
- decision: detection of edges using 1st or 2nd derivatives combined with thresholding.

Linear edge operators :
- Convolution with edge templates (Prewit, Sobel, Kirsh)
- Zero-crossings of LoG convolution
- Zero-crossings of directional derivatives of smoothed images (Canny)

*fin partie intro cecilia*

In our project, we shall begin by documenting the 3 main linear edge detection algorithms in ImageJ[imagej].
Then, we will create our own implementations of these algorithms using Ecmascript 6 [ecmascript] and a common Javascript enabled web browser so as to be able to do edge detection in images without relying upon ImageJ.
Finally, we will implement these algorithms using WebGL[WebGL] so as to take advantage of the processing power of the GPU *??c'est pour ca, non??*.
Each step (ImageJ, Ecmascript and WebGL implementations) will be benchmarked[benchmark] so as to study the advantages of the different algorithms, and the efficiency of the different implementations.


# 2.Material & Methods

* *description of the main algorithms and their implementation in ImageJ.*

## Sobel

The Sobel Operator, introduced in a presentation at the Standford A.I Project in 1968 by Irwin Sobel[sobel], is the default algorithm implemented in ImageJ for the Find Edges function, and is considered one of the simplest functional Edge Detection algorithms out there.

It works by using a filter mask to look for local maxima and minima in the first derivative of the image.
it uses two masks, one horizontal and one vertical (Fig2)

![http://aishack.in/tutorials/sobel-laplacian-edge-detectors/](https://github.com/bockp/Edge-Detection-project/blob/master/sobel-kernels1.jpg)

*to be completed
* include images of both filter results and combined density map
* finish describing algorithm and link to annex with the ImageJ implementation*

## Canny


## Laplacian based methods (Laplacian of Gaussian, Marr Filter):

The Laplacian is a 2D isotropic measure of the 2nd spatial derivative. It is used in image processing to detect regions of rapid intensity change in an image :
- In the regions of constant intensity (intensity gradient equal to zero), the Laplacian is equal to zero.
- In regions where there is a change in intensity, the Laplacian is positive on the darker side, and negative on the lighter side.
This has the effect of highlighting the edges in the image, and can be used as an enhancement technique, by adding the filtered image to the original image. 

Formula : *to insert ?*
The Laplacian operator is usually used on greylevel images, previously smoothed with a Gaussian filter to reduce noise.

Laplacian of Gaussian:
It is possible to convolve the Gaussian smoothing filter with the Laplacian filter, before convolving this Laplacian of Gaussian (LoG) with the image. The Gaussian and Laplacian kernels are both small so it requires fewer operations than using both filters on the image. Another advantage of the LoG is that it can be calculated in advance as it is independent of the image to process.
Formula *to insert ?*

Zero-crossing detector:
It is not possible to extract directly the edge orientation information from the Laplacian output. To extract the edges, we need to detect the zero-crossings in the output of the Laplacian, i.e. the regions of the image where the Laplacian passes through zero. However this can also happen in regions that are features other than edges in the image.
The input of the zero-crossing detector is the LoG filtered image, and the output is a binary image with lines representing the positions of all the zero-crossing points. All of the contour lines are closed lines because the strength of the edge is not considered so even gradual intensity transitions result in a zero-crossing. Local minima of the gradient magnitude can cause phantom edges, that can be eliminated by using a threshold for edge strength (this causes breaks in the closed contours).
This detector is highly influenced by the standard deviation used for the Gaussian filter applied to the image. 

In ImageJ :
- FeatureJ > Laplacian
Parameter : laplacian smoothing scale (= stdev for the Gaussian kernel)
*plugin based ? if so we need to cite the plugin article, if there is one, and precise in our article it's a plugin and where to get it.*


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








* ***NO websites***

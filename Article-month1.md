# 1.Introduction

Image processing is one of the most important fields in the domain of computer vision [Bovik]. Indeed, nearly every branch of science has a subdiscipline dedicated to retrieving information from the world, nearly always through the use of recording devices storing that information in the form of discrete images or videos.
(remplacer le 2eme nearly par almost ?)
For a computer to make sense of these images, it needs to be able to interprete them, understand them.
That is where Image Processing comes in, allowing a computer to process an image and detect its major features, and to perform higher-level vision tasks like face recognition.
In our project, we will examine one specific field of image processing, called edge detection.

The physical notion of edge comes from the shape of three dimensional objects or by their material properties. Obviously, as the aquisition process transaltes 3D scenes to 2D representations, this definition does not apply to image processing. In this report we will use the following definition : "An edge can generally be defined as a boundary or contour that separates adjacent image regions having relatively distinct characteristics according to some features of interest. Most often this feature is gray level or luminance”[Bovik]. According to this definition, the pixels of an image belonging to an edge are the pixels located in regions of abrupt gray level changes. Moreover, to avoid counting noise pixels as edges, the pixels have to be part of a contour-like structure.
Edge detection is the process of finding the pixels belonging to the edges in an image, and producing a binary image showing the locations of the edge pixels. The derivative or the gradient of the grey level intensity can be used to detect edges, as abrupt intensity changes translates to local extrema in the 1st derivative (Sobel approach), and to a zero-crossing in the 2nd derivative (Laplacian approach).

Edge detectors based on the derivative are sensitive to noise, which lead to the development of several algorithms. Most of them use a filter to reduce noise before actually detecting edges in the image.[Bovik]
These algorithms usually have three main steps:
- smoothing: use of a filter to suppress the noise.
- differentiation: amplification of the edges in the image
- decision: detection of edges using 1st or 2nd derivatives usually combined with thresholding.

Errors in edge detection can be either false positives (classification of non edge pixels as edge pixels) or false negatives (classification of edge pixels as non-edge pixels). There is also a conflict between the correct detection of edges and the precise localization of their position. 

In our project, we shall begin by documenting the 3 main linear edge detection approaches and algorithms, and their implentation in the image processing software ImageJ[imagej]:
- Convolution with edge templates (Prewit, Sobel, Kirsh)[refs ?]
- Zero-crossings of Laplacian of Gaussian convolution [marr-hildreth]
- Zero-crossings of directional derivatives of smoothed images (Canny)[Canny, 1986]

We will then perform a benchmark on the imageJ plugins, in order to compare them by measuring their execution time, the memory load for the JVM, and ?????????



# 2.Material & Methods

* *description of the main algorithms and their implementation in ImageJ. A pacer dans l'ordre chronologique de préférence*

![Fig1](https://github.com/bockp/Edge-Detection-project/blob/master/derivatives.png)

**Fig.1: Edge detection in a 1D continuous space : fc(x) is the gray level intensity function, fc'(x) is the 1st derivative, and fc''(x) is the 2nd derivative. The dotted lines represent the edge locations**[Bovik]

## Sobel

The Sobel Operator, introduced in a presentation at the Standford A.I Project in 1968 by Irwin Sobel[sobel], is the default algorithm implemented in ImageJ for the Find Edges function, and is considered one of the simplest functional Edge Detection algorithms out there.

*Ajouter l'équation de la dérivée seconde + explications*

It is based on the 1st derivative, or gradient, of the gray level intensity function [Equation.1]. 

![Equation.1](https://github.com/bockp/Edge-Detection-project/blob/master/gradient.jpg)

**Equation.1: Gradient of a continuous gray level intensity function fc(x,y), where ix and iy are the unit vectors in the x and y directions [Bovik]**

After finding all the local extrema of the gradient magnitude, a thresholding is applied and the points where the magnitude is superior to a given threshold are classified as candidate edge points [Equation.2].

![Equation.2](https://github.com/bockp/Edge-Detection-project/blob/master/gradient_thr.jpg)

**Equation.2: Thresholding of the gradient magnitude, where T is the threshold[Bovik] **

Finally, to obtain edges as zero-width segments, a thinning step is required : if the gradient magnitude is not a local maximum along the gradient direction, the point is suppressed from the edge candidates.

In practice, this algorithm works by using two masks, one horizontal and one vertical[sobelAlgo] (Fig2), these masks are designed to respond maximally to edges in the horizontal and vertical directions, respectively, and also smoothen out the gaussian noise in advance to reduce the noise sensitivity of the algorithm.

![Fig.2](https://github.com/bockp/Edge-Detection-project/blob/master/filters.png)

**Fig.2: Sobel horizontal and vertical masks**

The two resulting images are then combined to get an image representing the approximate  absolute  gradient  magnitude of the original image.

![Fig.3](https://github.com/bockp/Edge-Detection-project/blob/master/BikesgrayFig3.jpg)

**Fig.3: (a)original image,(b) Sobel Y-gradient image, (c) sobel X-gradient image, (d)absolute gradient magnitude image**

## Laplacian based methods (Laplacian of Gaussian, Marr-Hidreth Filter):

*formulas described in Bovik... to be inserted to illustate each step*

The Laplacian is a 2D isotropic measure of the 2nd spatial derivative [Equation.3]. It is used to detect regions of rapid intensity change in an image :
- In the regions of constant intensity (intensity gradient equal to zero), the Laplacian is equal to zero. 
- In regions where there is a change in intensity, the Laplacian is positive on the darker side, and negative on the lighter side.

![Equation.3](https://github.com/bockp/Edge-Detection-project/blob/master/laplacian.jpg)

**Equation.3: Laplacian of a continuous gray level intensity function fc(x,y) [Bovik]** 

This has the effect of highlighting the edges in the image, and can be used as an enhancement technique, by adding the filtered image to the original image. 

The Laplacian can be estimated by designing a pair of 1D 2nd derivative filters and combining them into a 2D filter [Equation.4]

![Equation.4](https://github.com/bockp/Edge-Detection-project/blob/master/discrete_laplacian.jpg)

**Equation.4: Discrete Laplacian estimate for an image f(n1,n2) [Bovik]**

Other 3x3 kernels are :

![Figure](https://github.com/bockp/Edge-Detection-project/blob/master/kernel_laplacian.jpg)

*A remplacer par une figure comme dans la partie Sobel ???*

The Laplacian opeator is usually used on gray level images, previously smoothed with a Gaussian filter to reduce noise. It is also possible to convolve the Gaussian smoothing filter with the Laplacian filter, before convolving this Laplacian of Gaussian (LoG) [Equation.5] with the image. 

![Equation.5](https://github.com/bockp/Edge-Detection-project/blob/master/LoG.jpg)

**Equation.5: Laplacian of Gaussian function gc(x,y), where sigma is the standard deviation of the Gaussian function [Bovik]**

To implement a discrete form, a filter can be constructed by sampling this equation after choosing a value for sigma. The Gaussian and Laplacian kernels are both small so it requires fewer operations than using both filters on the image. Another advantage of the LoG is that it can be calculated in advance as it is independent of the image being processed. It is important to note that the result of these edge detectors is highly influenced by the standard deviation used for the Gaussian filter chosen for the smoothing step. 

It is not possible to directly extract the edge orientation information from the Laplacian output. To extract the edges, we need to detect the zero-crossings in the output of the Laplacian (or the LoG), i.e. the regions of the image where the Laplacian passes through zero. However this can also happen in regions that are features other than edges in the image and can be the cause of false positives.
The input of the zero-crossing detector is the LoG filtered image, and the output is a binary image with lines representing the positions of all the zero-crossing points. Each pixel of the image is compared to its eight immediate neighbors, and a pixel is classified as a zero-crossing if its sign is different than the sign of its neighbor. [Equation.6] 

![Equation.6](https://github.com/bockp/Edge-Detection-project/blob/master/zero_cross.jpg)

**Equation.6: Zero-crossing classification of a pixel p [Bovik]**

All of the contour lines are closed lines because the strength of the edge is not considered, so even gradual intensity transitions result in a zero-crossing. As previously indicated, local minima of the gradient magnitude can cause false edges, that can be eliminated by using a threshold for edge strength, causing breaks in the closed contours.

In ImageJ, two plugins provide an implementation of the LoG operator :
- The Laplacian plugin of FeatureJ package  (*j'ai un lien : https://imagescience.org/meijering/software/featurej/laplacian/ mais pas de publi associée...*)
This plugin is based on ImageScience, a java library for image processing (*pareil : https://imagescience.org/meijering/software/imagescience/ *) which provides tools for computing the LoG of an image and detecting the zero-crossings. The only parameter accessible to the user is the "laplacian smoothing scale", meaning the standard deviation used for the Gaussian kernel.
(*résumé rapide du workflow de l'algorithme*)
- The LoG_Filter plugin (*https://imagej.nih.gov/ij/plugins/log-filter.html*).
This plugin is a standalone and provides more parameters to the user : sigma

## Canny

The Canny approach use a mathematical representation, through a convolution, in order to define edges in a gray-level image. By cross-section, the signal on an image will be converted as a gradient in a specific direction [Fig.4] and defined a one-dimensional model for which local maxima will correspond to edges. 

![Fig4](https://github.com/bockp/Edge-Detection-project/blob/master/initial_signal.png)

**Fig.4: Grey-level signal after the cross section of a target picture**

The answer signal will be subdivided into two compounds : a noise function and a edge function. So, the edge is detect by the convolution of the signal with a specific filter which had to maximize the result to a mathematical equation which is the representation of three parameters of optimization. Unlike the others methods, the aim was to be able to combine the detection of the edge, its closer localization on the image and not duplicate the edges founded, this last point is also called the unambiguity of the signal 
(pas encore sure de ma transition avec la phrase suivante). 
Three mathematical parameters will be thus define and taken into account to assess the edge function : the signal-to-noise ratio (SNR), the Localization and several constrains. The two first ones will be defined as parameters of equal importance which have to be maximized in parallel, and the third as a constraint. So, the function have to maximize the following equation [Fig.5]

![Fig5](https://github.com/bockp/Edge-Detection-project/blob/master/Canny_equation_maximization.png)

**Fig.5: Equation used to define the best function to find edges from a grey-level signal [Canny, 1986]**

# 3.Results

* *examples of the image processing and a benchmark of the different algorithms.*


# 4.Discussion

* *comparison of benchmarks of different implementations, ways to improve them (probably more towards the second month), recent innovations to imrpove the algorithms.*

# 5.Conclusion


# References

[Bovik] Bovik, Alan C., ed. The essential guide to image processing. Academic Press, 2009.

[Canny, 1986] Canny, J. A Computational Approach to Edge Detection. IEEE Transactions on Pattern Analysis and Machine Intelligence (1986), PAMI-8:6, pp. 679-698, Nov. doi: 10.1109/TPAMI.1986.4767851

[Deriche, 1987] Deriche, R. Using Canny's criteria to derive a recursively implemented optimal edge detector. Int J Comput Vision (1987) 1:167. https://doi.org/10.1007/BF00123164

[*??quel ref*] 

[*ref article disant cela*]


[imagej] : Schindelin, J.; Rueden, C. T. & Hiner, M. C. et al. (2015), ["The ImageJ ecosystem: An open platform for biomedical image analysis"](http://onlinelibrary.wiley.com/doi/10.1002/mrd.22489/full), Molecular Reproduction and Development, PMID 26153368 

[ecmascript] ECMAScript, E. C. M. A., and European Computer Manufacturers Association. "Ecmascript language specification." (2011).

[WebGL] Marrin, Chris. "Webgl specification." Khronos WebGL Working Group (2011).

[benchmark] McNair, Carol Jean, and Kathleen HJ Leibfried. Benchmarking: A tool for continuous improvement. John Wiley & sons, 1992.

[sobel] Sobel, Irwin. (2014). An Isotropic 3X3 Image Gradient Operator. Presentation at Stanford A.I. Project 1968.
[sobelAlgo] Gupta, Samta, and Susmita Ghosh Mazumdar. "Sobel edge detection algorithm." International journal of computer science and management Research 2.2 (2013): 1578-1583.

[marr-hildreth] Marr, D. and Hildreth, E. Theory of edge detection. Proc. R. Soc. Lond. B,270:187-217,1980.



* ***NO websites***

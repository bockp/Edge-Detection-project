# Edge detection

Authors : Ophélie Thierry

[comment]: <>
[comment]: <cthis is a comment>

## Introduction

### Several general notions about the edge detection

Image processing is one of the most important fields in the domain of computer vision[^BOV2009]. Most scientific domains use information extracted from images in one way or another. For a computer to make sense of these images, and be able to extract meaningful data from them, it needs to be able to interprete and understand them.
That is where Image Processing comes in, allowing a computer to process an image and detect its major features and reducing mistakes, variance linked to the experimenter leading to less biased conclusions, perform higher-level vision tasks like face recognition [^DOH2012] [^SCH2015]. In our project, we will examine one specific field of image processing called edge detection.

The physical notion of edge comes from the shape of three dimensional objects or from their material properties. But, seeing as the acquisition process translates 3D scenes to 2D representations, this definition does not apply to image processing. In this report we will use the following definition by Bovik (2009): "An edge can generally be defined as a boundary or contour that separates adjacent image regions having relatively distinct characteristics according to some features of interest. Most often this feature is gray level or luminance”[^BOV2009]. According to this definition, the pixels of an image belonging to an edge are the pixels located in regions of abrupt gray level changes. Moreover, to avoid counting noise pixels as edges, the pixels have to be part of a contour-like structure.
Edge detection is the process of finding the pixels belonging to the edges in an image, and producing a binary image showing the locations of the edge pixels.

Among all the implemented image analysis software, ImageJ is one of the most used as one of the most ancient, free, open-source, easy to use and with an extansive architecture implemented in Java. It's a generalist software but the differents plugins coded by the community allow it to take care of a wide range of images and be enough configurable to become very efficient and specific [^DOH2012] [^SCH2012] [^ELI2015] [^RUE2017] [^KAI2015].

### Interest of changing the implementation language.

### Aim of the project

In our project, we began by documenting the main linear edge detection approaches and algorithms, and their implementation in the image processing software ImageJ [^SCH2015]:

* Convolution with edge templates (Prewitt [^PRE1970], Sobel [^SOB1968], Kirsch [^KIR1971], Robert's Cross [^ROB1963])
* Zero-crossings of Laplacian of Gaussian convolution[^MAR1980]
* Zero-crossings of directional derivatives of smoothed images (Canny[^CAN1986])

We then performed a benchmark on the ImageJ plugins, in order to compare their execution time and the memory load for the Java Virtual Machine (JVM). For the second and third part of our project, we made respectively our own implementations of the Sobel, Prewitt, Robert's cros, Canny and Laplacian of Gaussian operators using ECMAscript6[^ECMA2011] and WebGL2 [^HAL2014].

This repport will be focused on the three convolutions with edge templates : Prewitt, Sobel and Robert's Cross.

The link to our github repository containing our reports in markdown format, the images, and the code for the benchmark and algorithms is : https://github.com/bockp/Edge-Detection-project.

## Material & Methods
[comment]: <Material & Methods: A very detailed description of the algorithm you implemented.>

## Results
[comment]: <Results: A comparison between ImageJ, CPU and GPU depending of image size and kernel size (if any).>

## Discussion
[comment]: <Discussion: what about the benchmarks.>

## Conclusion
[comment]: <Conclusion: conclusion, improvements, perspectives>



## References

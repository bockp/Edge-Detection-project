# Edge detection

Author : Cécilia Ostertag

## Introduction

Image processing is one of the most important fields in the domain of computer vision[^BOV2009]. Most scientific domains use information extracted from images in one way or another. For a computer to make sense of these images, and be able to extract meaningful data from them, it needs to be able to interprete and understand them.
That is where Image Processing comes in, allowing a computer to process an image and detect its major features, and to perform higher-level vision tasks like face recognition.
In our project, we will examine one specific field of image processing called edge detection.

The physical notion of edge comes from the shape of three dimensional objects or from their material properties. But, seeing as the acquisition process translates 3D scenes to 2D representations, this definition does not apply to image processing. In this report we will use the following definition by Bovik[^BOV2009] (2009): "An edge can generally be defined as a boundary or contour that separates adjacent image regions having relatively distinct characteristics according to some features of interest. Most often this feature is gray level or luminance”. According to this definition, the pixels of an image belonging to an edge are the pixels located in regions of abrupt gray level changes. Moreover, to avoid counting noise pixels as edges, the pixels have to be part of a contour-like structure.
Edge detection is the process of finding the pixels belonging to the edges in an image, and producing a binary image showing the locations of the edge pixels.

In our project, we began by documenting the main linear edge detection approaches and algorithms, and their implementation in the image processing software ImageJ. We then performed a benchmark on the ImageJ plugins, in order to compare their execution time and the memory load for the Java Virtual Machine (JVM).

For the second part of our project, we made our own implementations of the Sobel, Prewitt, Robert's cros, Canny and Laplacian of Gaussian operators using ECMAscript6[^ECMA2011].

In this report, I will present the last part of our project : the implementation of Canny's algorithm using the GPU via the API WebGL 2. Finally, I will be able to compare qualitatively and quantitatively the CPU and GPU implementations, and to compare the GPU implementation with ImageJ plugin's implemenation.



**This report (written using the markdown format), and associated files, is stored in a repository on github:**
https://github.com/bockp/Edge-Detection-project



## Material & Methods


### Principle of Canny’s algorithm :

Canny’s algorithm uses the following steps:
- Noise reduction by convolving the image with a Gaussian filter of a given standard deviation
- Computation of the intensity gradient magnitude and orientation 
- Dividing orientation values (theta) into 4 directions : horizontal (0°), north-east /south-west(45°), vertical (90°), and north-west/south-east direction (135°)
- Non-maximum suppression by only keeping pixels which value is the maximum compared to the values of the two surrounding pixels according to the gradient orientation
- Finding strong edge pixels and weak edge pixels using a low and a high threshold values
- Tracing edges with hysteresis, by keeping weak edge pixels next to strong edge pixels and then extending the edges in several passes

### Fragment shaders :

All of the fragment shaders used for this implementation are adapted from Seth George Hall's thesis [^HAL2014] showing an implementation of Canny edge detection using OpenGL ES 2.0. It uses a pipeline of five fragment shaders, linked together via framebuffers [Fig.1] :

![Fig.1](images/pipeline.png)

**Fig.1: Canny edge detection pipeline using OpenGL ES 2.0[^HAL2014]**

The first two shaders correspond to a gaussian blur performed in two passes, horizontal and vertical, using a 5x5 kernel. The kernel is passed to the shader as a *uniform* float array, containing the following values : 0.0625, 0.25, 0.375, 0.25, 0.0625. The output is the resulting pixel value.

The third shader is the computation of the gradient magnitude and orientation using Sobel's horizontal and vertical kernels. Here I modified the original code because the author ommited to flip the kernels before the convolution so it was giving poor results. The kernels are defined as *uniform* parameters. To compute the gradient direction, the author's method is to multiply the gradient with a rotation matrix and measure it's angle, and then classifying this angle into eight directions. The result of this step is stored into the output : **outColor.r** is the gradient magnitude and **outColor.gb** is the (X,Y) orientation of the gradient.

The fourth shader performs the non-maximum suppressions and the double threshold. For the non-maximum suppression, the gradient magnitude of the neighboring pixel in the gradient direction are computed and then compared to the gradient magnitude of the current pixel, using the *step* function. If it is not the maximum, the gradient magnitude value is multiplied by 0. The *smoothstep* function is then used to compare the gradient magnitude to the low and high threshold. This way if the gradient magnitude of the current pixel is either not a maximum or inferior to the low threshold the pixel stength is set to 0. If it is superior to the high threshold, meaning that it is a strong pixel, its stength is set to 1, and if it is a weak pixel its strength will be between 0 and 1. In the output, **outColor.r** is the strength value, and the three other components are equal to zero.

Finally, the last shader performs the edge tracing with the hysteresis. The edge strength of the eight neighboring pixels is retrieved, and the pixel is accepted as an edge pixel if the sum of the eight neighbors' strenght is superior to 2. The last line is modified so that the output value is equal to 1 if the pixel is an edge, and to 0 if the pixel is not an edge.

## Results

### Edge detection using Canny’s algorithm :

The following figure represents the result of the GPU *canny()* function with parameters low threshold = 50.0, high threshold = 100.0, compared with the result of the CPU *canny()* function with parameters low threshold = 15.0, high threshold = 30.0, and sigma = 2.0 , and the plugin Canny Edge Detector[^GIB2011] with parameters low threshold = 2.5, high threshold = 5.0, and sigma = 2.0 [Fig.2]. We can see that the edges of the face, hat and shoulder are well detected, as well as some details on the hat feathers. The GPU function is more effective at detecting the small details like the eyes, lipes and feathers. Also, contrarly to the CPU function there are no false edges created by the borders of the image. 

![Fig.2](images/canny_comparison_GPU.jpg)

**Fig.2: Result of Canny edge detection. 1:original image, 2:output of GPU function, 3:output of CPU function,4:output of ImageJ Canny Edge Detector plugin**

# A CONTINUER .......

### Benchmarking process

The benchmark was done using a computer with an Intel core I7 @4.0 Ghz, on Linux Ubuntu 16.04 64 bits with a kernel 4.10. The version of ImageJ is the 1.51q, using Java 1.8.0\_112 (64 bits). We fixed the choice of processor with the taskset command to avoid a sharing of the processor load, and finally we fixed the ImageJ process with a high priority to avoid preemption.

For this benchmark, we used the same picture (Lena, in uint8, uint16 or float32), in five different sizes : 128x128 px, 256x256 px, 512x512 px, 1024x1024 px, and 2048x2048 px, to show how the performance of our functions vary when increasing the complexity of the input image. We performed this benchmark on our functions as well as the functions available in ImageJ described in the previous report. For the implementation of the benchmarks see the files *benchmark.js* for the ImageJ functions, and *benchmarkForTiji.js* for our functions, in our GitHub repository. 



### Benchmark results

#### Execution time

Finally, for Canny algorithm, we compared our function with the plugins Canny Edge Detector by Tom Gibara (thresholds = 2.5 and 5.0, sigma=2) and FeatureJ Edges by Erik Meijering (thresholds = 2.5 and 5.0, sigma=2) ([Fig.13]). Our function outperforms the Canny Edge Detector function, which we showed in our previous report was unexpectedly time consuming.  For sizes up to 512x512 px, our function has a lower execution time than FeatureJ’s, for 1024x1024 px images, it takes twice the time, and is more than three times slower for 2048x2048 px images. 

![Fig.13](images/canny_graph.jpeg){ width=50% height=50%}

**Fig.13: Execution time of all of our *canny()* function and ImageJCanny Edge Detector and FeatureJ Edges plugins, with five increasing image sizes (uint8 images)**

With uint16 ([Fig.14]) and float32 ([Fig.15]) images, we can see that the execution time for *sobel()*, *prewitt()* and *robertscross()* functions do not vary, whereas it increases for the *LoG()* and *canny()* functions. However this is a small augmentation, so we can conclude that the type of the image does not have a strong impact on the processing time of our functions. 

![Fig.14](images/all_graph_16.jpeg){ width=50% height=50%}

**Fig.14: Execution time of all of our functions with five increasing image sizes, for uint16 images**

![Fig.15](images/all_graph_32.jpeg){ width=50% height=50%}

**Fig.15: Execution time of all of our functions with five increasing image sizes, for float32 images**

#### Memory load

We roughly estimated the memory usage of each of our functions by calculating the size allocated to the arrays (the allocation for the primitive data types are insignificant here). For example in the *sobel()* function we allocate 4 HxW arrays, 2 (H+k/2)x(W+k/2) arrays, and 1 kxk array (with H and W the height  and width of the image, and k the kernel dimension). We estimated this memory usage for uint8, uint16 and float32 images, and for the same image sizes as in our benchmark for the execution time. Our results ([Fig.?]) show that the *canny()* function is the most impacted both by the enlargement of the input image and by the type of the input image. This function allocates 1 HxW uint8 array, 10 HxW arrays of the image type, 3 (H+k/2)x(W+k/2) arrays, plus the kxk array for the gaussian blur and 2 arrays of the image type and variable length during the hysteresis phase, so it was expected to be memory expensive.  

![Fig.16](images/all_memory.jpeg){ width=50% height=50%}

**Fig.16: Estimated memory allocation for of all of our functions, for five increasing image sizes and three image types (uint8, uint16, float32)**


## Discussion

### Qualitative Comparison

For the LoG and Canny algorithm implementation,  we do not obtain the same results as the ImageJ plugins with the same parameters, but we can obtain similar output images by changing the values of these parameters. The GPU function is more sensitive to details, even with high threshold values.

### Performance Comparison

Our functions can handle the processing of pictures up to 2048x2048 pixels and maybe higher, and three types : uint8, uint16, and float32. This was also the case of ImageJ’s functions.

They have an important execution time, which increases with the size of the input images. This was expected because our functions rely mostly on convolutions and successive operations on the input pixels. Our implementation of Canny’s algorithm is the slowest of our functions, and gets quickly slower because it needs several passes to elongate the edges.

In terms of memory load, the implementation of Canny’s algorithm is very expensive, while the LoG implementation is closer to Sobel, Prewitt, and Robert’s cross, so the *LoG()* function is a good compromise to have well detected edges without using too much memory.

## Conclusion

Using JavaScript, we implemented the most used edge detection algorithm for images, that can be executed on any web navigator. These functions give results similar to those obtained with the use of ImageJ. However it was expected that our functions would be outperformed by ImageJ’s and plugins, because they are coded in Java which is a more powerful language than JavaScript. Our LoG implementation is the function that gives the better tradeoff between precision in edge detection and execution time / memory load for the CPU.

To achieve better performance, we will use the WebGL JavaScript API to use the GPU instead of the CPU and have faster execution times thanks to its parallel architecture.


[^GIB2011]: Gibara T. Canny Edge Detector plugin for ImageJ image processor.

[^MEI2007]: Meijering E. FeatureJ: A Java Package for Image Feature Extraction.

[^ECMA2011]: ECMAScript EC. European Computer Manufacturers Association and others. ECMAScript language specification. 2011.

[^ROB1963]: Roberts LG. Machine perception of three-dimensional solids (Doctoral dissertation, Massachusetts Institute of Technology).

[^BOV2009]: Bovik AC, editor. The essential guide to image processing. Academic Press; 2009 Jul 8.

[^CAN1986]: Canny J. A computational approach to edge detection. IEEE Transactions on pattern analysis and machine intelligence. 1986 Nov(6):679-98.

[^HAL2014]: Hall SG. GPU Accelerated Feature Algorithms for Mobile Devices. March 2014.


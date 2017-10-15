# Edge detection

Authors : Peter Bock\*, Cécilia Ostertag, Ophélie Thierry

## Introduction

Image processing is one of the most important fields in the domain of computer vision[^BOV2009]. Most scientific domains use information extracted from images in one way or another. For a computer to make sense of these images, and be able to extract meaningful data from them, it needs to be able to interprete and understand them.
That is where Image Processing comes in, allowing a computer to process an image and detect its major features, and to perform higher-level vision tasks like face recognition.
In our project, we will examine one specific field of image processing called edge detection.

The physical notion of edge comes from the shape of three dimensional objects or from their material properties. But, seeing as the acquisition process translates 3D scenes to 2D representations, this definition does not apply to image processing. In this report we will use the following definition by Bovik[^BOV2009] (2009): "An edge can generally be defined as a boundary or contour that separates adjacent image regions having relatively distinct characteristics according to some features of interest. Most often this feature is gray level or luminance”. According to this definition, the pixels of an image belonging to an edge are the pixels located in regions of abrupt gray level changes. Moreover, to avoid counting noise pixels as edges, the pixels have to be part of a contour-like structure.
Edge detection is the process of finding the pixels belonging to the edges in an image, and producing a binary image showing the locations of the edge pixels. 

In our project, we began by documenting the main linear edge detection approaches and algorithms, and their implementation in the image processing software ImageJ[^SCH2015]:

* Convolution with edge templates (Prewit[^PRE1970], Sobel[^SOB1968], Kirsch[^KIR1971])
* Zero-crossings of Laplacian of Gaussian convolution[^MAR1980]
* Zero-crossings of directional derivatives of smoothed images (Canny[^CAN1986])

We then performed a benchmark on the ImageJ plugins, in order to compare their execution time and the memory load for the Java Virtual Machine (JVM).


For this second part of our project, we have chosen to make our own implementations of the Sobel, Canny and Laplacian of Gaussian Operators using ECMAscript6[^ECMA2011].

Additonally, we shall follow the AirBnB Javascript Programming Style guidelines*[^?]* to keep our image analysis programs uniform and understandable.

*Partie sur la lecture des algos? ou pas necessaire*


**Our report ( written using the markdown format), and associated files, is stored in a repository on github: 
https://github.com/bockp/Edge-Detection-project**.

## Material & Methods



### Benchmarking process


The benchmark was done using a computer with an Intel core I7 @4.0 Ghz, on Linux Ubuntu 16.04 64 bits with a kernel 4.10. The version of ImageJ is the 1.51q, using Java 1.8.0\_112 (64 bits). We fixed the processor fequency with acpi-cpufreq module to avoid a change of frequency during the benchmark, fixed the choice of processor with the taskset command to avoid a sharing of the processor load, and finally we fixed the ImageJ process with a high priority to avoid preemption.  


## Results

### Implementation of the Sobel Operator



### Implementation of the Laplacian of Gaussian Operator




### Implementation of the Canny Operator



### Benchmark results

*On laisse les resultats du dernier rapport, pour pouvoir comparer, ou on fait reference au dernier rapport en mettant les graphs seulement? si oui faudra enlever ce qui est dessous ici* 

The results of the benchmark for the execution time[Fig.17 and Fig.19] show that the Find Edges function is the quickest to run on this machine, with a mean of 0.88 ms, followed by Log\_Filter, FeatureJ Laplacian and FeatureJ Edges which do not have a mean execution time superior to 50 ms. However the Canny Edge Detector plugin has an average exectution time of 205.8 ms.

![Fig.17](images/bench_time.png)

**Fig.17: Result of the benchmark for the execution time of ImageJ edge detection functions. The Canny Edge Detector and FeatureJ Edges plugin use the Canny algorithm, FeatureJ Laplacian and Log Filter use the LoG, and Find Edges the Sobel**

For the JVM memory load [Fig.18 and Fig.19], we can see that Find Edges uses the least memory, with a mean of 27.4 MegaBytes. Then the three functions Canny Edge Detector, FeatureJ Edges and Log\_Filter have an average of about 50 MB. And finally the most memory expensive function is FeatureJ Laplacian with a mean of 55 MB.

The data are not normaly distributed. 

![Fig.18](images/bench_memory.png)

**Fig.18: Result of the benchmark for the memory load of ImageJ edge detection functions. The Canny Edge Detector and FeatureJ Edges plugin use the Canny algorithm, FeatureJ Laplacian and Log Filter use the LoG, and Find Edges the Sobel**

The data is not normaly distributed. Visually, the Find Edges algorithm have different results from the others for the time and the memory consuption. A Kruskal-Wallis test between its result and the results of the other algorithms shows a significant difference for both factors with the p-values associated being of less than 2e-06 and 2e-16 for respectively the memory and time consumption. 

For the plugins using a Laplacian approach, FeatureJ Laplacian and Log\_Filter, the means obtained for the time and the memory consumption are close to each other. A Kruskal-Wallis test between them shows that they are significantly different for the time consuption, with a p-value of 7.385e-12 but not for the memory load, which generate a p-value of 0,2282. 

In the same way, graphically, the difference between the results for the two Canny implementations, Canny Edge Detector and FeatureJ Edges, is difficult to assess for the memory consuption. Another Kruskal-Wallis test shows a significant difference between the mean of execution time, with a p-value of 2,2e-16, but not for the memory used, with a p-value of 0,4667. 

![Fig.19](images/bench.png)

**Fig.19: Average execution time and used memory for ImageJ edge detection functions. The Canny Edge Detector and FeatureJ Edges plugin use the Canny algorithm, FeatureJ Laplacian and Log Filter use the LoG, and Find Edges the Sobel**

Given that the Canny Edge Detector plugin can also be used on RGB images, we also ran a benchmark comparing the execution time and memory load difference for this plugin on RGB and 8-bit images[Fig.20].

![Fig.20](images/CannyRGBPlot.jpeg)

**Fig.20: Result of the benchmark of Canny Edge Detector plugin on 8-bit and RGB images, for both execution time and memory load**

The mean obtained by the benchmark for the JVM memory load and the time consumption are the same for the RGB and the 8-bits picture with respectively 51 MB and 205 ms, but the distribution of the data is not spread in the same way between the two sides of the median for the execution time. The data does not follow the Normal Distribution, and the Kruskal-Wallis test shows a significant difference only for the time consumption, with a p-value of 1e-04 against 0,49. 

## Discussion

### Qualitative Comparison


### Performance Comparison


## Conclusion


*faudra voir quels citations sont utilisée, ou si le systeme s'en fout que certains sont pas utilisée et quon peut les laisser sans problemes... même si alors on commencerait a avoir des soucis pour naviguer la aprtie citation XS*


[^ECMA2011]: ECMAScript EC. European Computer Manufacturers Association and others. ECMAScript language specification. 2011.

[^ABD2015]: Abdelsamea MM, Gnecco G, Gaber MM, Elyan E. On the relationship between variational level set-based and som-based active contours. Computational intelligence and neuroscience. 2015 Jan 1;2015:34.

[^BOV2009]: Bovik AC, editor. The essential guide to image processing. Academic Press; 2009 Jul 8.

[^CAN1986]: Canny J. A computational approach to edge detection. IEEE Transactions on pattern analysis and machine intelligence. 1986 Nov(6):679-98.

[^CHAA2014]: Chaabane SB, Fnaiech F. Color edges extraction using statistical features and automatic threshold technique: application to the breast cancer cells. Biomedical engineering online. 2014 Jan 23;13(1):4.

[^CHO2016]: Choudhry P. High-Throughput Method for Automated Colony and Cell Counting by Digital Image Analysis Based on Edge Detection. PLoS One. 2016; 11(2): e0148469. 

[^DAV1975]: Davis LS. A survey of edge detection techniques. Computer graphics and image processing. 1975 Sep 1;4(3):248-70.

[^DER1987]: Deriche R. Using Canny's criteria to derive a recursively implemented optimal edge detector. International journal of computer vision. 1987 Jun 1;1(2):167-87.

[^DIN2001]: Ding L, Goshtasby A. On the Canny edge detector. Pattern Recognition. 2001 Mar 31;34(3):721-5.

[^GRE2016]: Grega M, Matiolanski A, Leszczuk M. Automated Detection of Firearms and Knives in a CCTV Image. Sensors 2016, 16, 47; doi:10.3390/s16010047.

[^HAQ2015]: Haq I, Anwar S, Shah K, Khan MT, Shah SA. Fuzzy Logic Based Edge Detection in Smooth and Noisy Clinical Images. PLoS One. 10(9):e0138712, 2015.

[^JAL2017]: Jalalian A, Mashohor S, Mahmud R, Karasfi B, Saripan MIB, Ramli ARB. Foundation and Methodologies in computer-aided diagnosis systems for breast cancer detection. EXCLI Journal, 16:113-137, 2017.

[^KEK2010]: Kekre HB, Gharge SM. Image segmentation using extended edge operator for mammographic images. International journal on computer science and Engineering. 2010;2(4):1086-91.

[^KIR1971]: Kirsch RA. Computer determination of the constituent structure of biological images. Computers and biomedical research. 1971 Jun 1;4(3):315-28.

[^LUO2017]: Luo S, Yang J, Gao Q, Zhou S, Zhan CA. The Edge Detectors Suitable for Retinal OCT Image Segmentation. Journal of Healthcare Engineering 2017; 2017: 3978410. 

[^MAI2009]: Maini R, Aggarwal H. Study and comparison of various image edge detection techniques. International journal of image processing (IJIP). 2009 Jan;3(1):1-1.

[^MAR1980]: Marr D, Hildreth E. Theory of edge detection. Proceedings of the Royal Society of London B: Biological Sciences. 1980 Feb 29;207(1167):187-217.

[^PRE1970]: Prewitt JM. Object enhancement and extraction. Picture processing and Psychopictorics. 1970 Jan 1;10(1):15-9.

[^RIC1945]: Rice SO. Mathematical analysis of random noise. The Bell System Technical Journal. 1945 Jan;24(1):46-156.

[^SCH1997]: Scharcanski J and Venetsanopoulos A.N. Edge detection of color images using directional operators. IEEE Trans. Circuits Syst. Video Technol., 7(2):397–401, 1997. 

[^SCH2015]: Schindelin J, Rueden CT, Hiner MC, Eliceiri KW. The ImageJ ecosystem: An open platform for biomedical image analysis. Molecular reproduction and development. 2015 Jul 1;82(7-8):518-29.

[^SOB1968]: Sobel I. An isotropic 3× 3 image gradient operator, presentation at Stanford Artificial Intelligence Project (SAIL).

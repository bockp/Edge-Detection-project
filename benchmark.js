//Authors : Peter Bock, Cecilia Ostertag

function benchmark(img, functionNameString, parameters, timeList, memoryList)
{
	var startTime,endTime,time,memory;

	IJ.freeMemory(); //run garbage collector

 	startTime = System.currentTimeMillis();
	IJ.run(img, functionNameString, parameters);
	endTime = System.currentTimeMillis();	
	time = endTime - startTime;
	memory = IJ.currentMemory(); //memory currently being used by ImageJ
	timeList.push(time);
	memoryList.push(memory/1048576);//convert bytes to MB
}

function runBenchmark(imp, functionNameString, parameters)
{
	IJ.log("Front loading...\n");
	//------------------------------------FRONT-LOADING------------------------------

	//front-load 5 times without saving the returned timing
	var timeList=[],memoryList=[];
	for(var i = 0; i<5; i++){

		impDupl = imp.duplicate();
		benchmark(impDupl,functionNameString,parameters,timeList, memoryList);

		if(i==0)
		{
			IJ.log("first results :\n");
			IJ.log("time: "+timeList[i]);
			IJ.log("memory: "+memoryList[i]);
		}
		
	}
	//IJ.run("Close All Windows", ""); //close all image windows
	//------------------------------------BENCHMARKING------------------------------

	IJ.log("Benchmarking the function "+functionNameString+"\n");

		timeList = []; 
		memoryLsit = [];
		var loops = 20;
		for(var j = 0; j < loops; j++){
			impDupl = imp.duplicate();
			benchmark(impDupl,functionNameString,parameters,timeList, memoryList);
			
		}
		IJ.run("Close All Windows", "");
	IJ.log("End of benchmark\n");
	for(var i=0;i<timeList.length;i++)
		{
			IJ.log(functionNameString+","+timeList[i]+","+memoryList[i]+"\n");
		}
	IJ.log("\n");
}

// Main program

imgList=["/home/lyria/Edge-Detection-project/samples/Lenna_128.jpg","/home/lyria/Edge-Detection-project/samples/Lenna_256.jpg","/home/lyria/Edge-Detection-project/samples/Lenna_512.jpg","/home/lyria/Edge-Detection-project/samples/Lenna_1024.jpg","/home/lyria/Edge-Detection-project/samples/Lenna_2048.jpg"];

for (var j=0; j<imgList.length;j++)
{


functionNames = ["Find Edges","Log Filter","FeatureJ Laplacian","Canny Edge Detector","FeatureJ Edges"];
parametersList = ["","sigma=1.4 filterwidth=9 threshold=0 delta=0 mode=4","compute smoothing=1.4 detect","gaussian=2 low=2.5 high=5.0","compute smoothing=2.0 suppress lower=2.5 higher=5.0"];


for (var i=0;i<functionNames.length;i++)
{
	imp = IJ.openImage(imgList[j]); 
	imp.show();
	functionNameString = functionNames[i];
	parameters = parametersList[i];
	runBenchmark(imp, functionNameString, parameters);
	IJ.freeMemory(); 
}
}


//runBenchmark(imp, functionNames[4], parametersList[4]);

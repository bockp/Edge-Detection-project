function benchmarkFunction(img, functionNameString, parameters){
	// this function takes an imagePlus object (AKA., an image) 
	//and the String needed to run a function using IJ.run()
	//
	// It then returns the time it took for said function to run on the image, to the user.

	
	var startTime = System.currentTimeMillis();
	IJ.run(img, functionNameString, parameters);
	var endTime = System.currentTimeMillis();	
	var time = endTime - startTime;
	return time;
	
	
}

function benchmarkMemory(img, functionNameString, parameters)
{
	IJ.freeMemory(); //run garbage collector
	IJ.run(img, functionNameString, parameters);	
	var memory = IJ.currentMemory(); //memory currently being used by ImageJ
	return memory;

}

function runBenchmark(img, functionNameString, parameters)
{
	IJ.log("Front loading...\n");
	//------------------------------------FRONT-LOADING------------------------------

	//front-load 100 times without saving the returned timing

	for(var i = 0; i<100; i++){
		IJ.log(i);
		// does running the function itself inside a function cause the memory to get wiped 
		// once you exit the function ? no idea XS
		// need to check this !!!

		//note: before and after I functionalized (AKA., put everything in a function) the script has the same average execution time.
		// so doesn't seem to impact anything. can't be really sure, though...

		impDupl = imp.duplicate();
		//impDupl.show();
		benchmarkFunction(impDupl,functionNameString,parameters);
		benchmarkMemory(impDupl,functionNameString,parameters);
		//impDupl.close();
		IJ.run("Close All Windows", "");
	
	}

	//------------------------------------BENCHMARKING------------------------------

	IJ.log("Benchmarking the function "+functionNameString+"\n");
	var list_time = [];
	var list_mem = [];

	for (var test=0; test<10;test++){
		// the Test loop redoes the actual timing loop 10 times to check for variance in the average time found.

		var time = 0.0; // time variable to add all times to. we shall then divide by 1000 and voila, instant average !
		var memory = 0;
		var loops = 1000;
		for(var j = 0; j < loops; j++){
	
			impDupl = imp.duplicate();
			time += benchmarkFunction(impDupl,functionNameString,parameters);
			memory += benchmarkMemory(impDupl,functionNameString,parameters);
			//impDupl.close();
			IJ.run("Close All Windows", "");
		}



		// calculate average value of  and return to user explaining how many iterations were used for the average.
		var average = time/loops;
		var avg_mem = memory/loops;
		avg_mem = avg_mem/1048576; //convert bytes to MB
		IJ.log("The average execution time is "+average+" ms.\n");
		IJ.log("The average used memory is "+avg_mem.toFixed(2)+" MB.\n");
		list_time.push(average);
		list_mem.push(avg_mem);
	}

	IJ.log("End of benchmark\n");
	IJ.log("Avg time,Avg memory\n");
	for(var i=0;i<list_time.length;i++)
		{
			IJ.log(list_time[i]+","+list_mem[i]+"\n");
		}
	IJ.log("\n");
}


// VARIABLE VARIABLES (XD):

imp = IJ.openImage("http://wsr.imagej.net/images/lena-std.tif"); // opens Lena sample image, on which we run the benchmark 
// same image for every benchmark.
IJ.run(imp, "8-bit", ""); //convert image to 8-bit greyscale


// maybe use several images, 
// and incorporate the loops themselves into a function that take an image,
// and a functionNameString and runs the benchmark on it ?

functionNames = ["Find Edges","Log Filter","FeatureJ Laplacian","Canny Edge Detector","FeatureJ Edges"];
parametersList = ["","sigma=3 filterwidth=2 threshold=0 delta=0 mode=4","compute smoothing=3.0 detect","gaussian=2 low=2.5 high=7.5","compute smoothing=2.0 suppress lower=2.5 higher=7.5"];


for (var i=0;i<functionNames.length;i++)
{
	functionNameString = functionNames[i];
	parameters = parametersList[i];
	runBenchmark(imp, functionNameString, parameters);
	IJ.freeMemory(); //garbage collector
}


//runBenchmark(imp, "FeatureJ Edges", "compute smoothing=2.0 suppress lower=2.5 higher=7.5");






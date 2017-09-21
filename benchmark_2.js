

function benchmarkFunction(img, functionNameString){
	// this function takes an imagePlus object (AKA., an image) 
	//and the String needed to run a function using IJ.run()
	//
	// It then returns the time it took for said function to run on the image, to the user.

	
	var startTime = System.currentTimeMillis();
	IJ.run(img, functionNameString, "");
	var endTime = System.currentTimeMillis();	
	var time = endTime - startTime;
	return time;
	
	
}

function benchmarkMemory(img, functionNameString)
{
	IJ.freeMemory(); //run garbage collector
	IJ.run(img, functionNameString, "");	
	var memory = IJ.currentMemory(); //memory currently being used by ImageJ
	return memory;

}

// VARIABLE VARIABLES (XD):

imp = IJ.openImage("http://wsr.imagej.net/images/lena-std.tif"); // opens Lena sample image, on which we run the benchmark 
// same image for every benchmark.
IJ.run(imp, "8-bit", ""); //convert image to 8-bit greyscale


// maybe use several images, 
// and incorporate the loops themselves into a function that take an image,
// and a functionNameString and runs the benchmark on it ?

functionNameString = "Find Edges";
// Must be changed depending on which function we want to benchmark.





//------------------------------------FRONT-LOADING------------------------------

//front-load 100 times without saving the returned timing

for(var i = 0; i<100; i++){
	// does running the function itself inside a function cause the memory to get wiped 
	// once you exit the function ? no idea XS
	// need to check this !!!

	//note: before and after I functionalized (AKA., put everything in a function) the script has the same average execution time.
	// so doesn't seem to impact anything. can't be really sure, though...

	impDupl = imp.duplicate();
	benchmarkFunction(impDupl,functionNameString);
	impDupl.close();
	
}

//------------------------------------BENCHMARKING------------------------------


for (var test=0; test<10;test++){
	// the Test loop redoes the actual timing loop 10 times to check for variance in the average time found.

	var time = 0.0; // time variable to add all times to. we shall then divide by 1000 and voila, instant average !
	var memory = 0;

	for(var j = 0; j < 1000; j++){
	
		impDupl = imp.duplicate();
		time += benchmarkFunction(impDupl,functionNameString);
		memory += benchmarkMemory(impDupl,functionNameString);
		impDupl.close();
	}



	// calculate average value of  and return to user explaining how many iterations were used for the average.
	var average = time/1000;
	var avg_mem = memory/1000;
	avg_mem = avg_mem/1048576; //convert bytes to MB
	IJ.log("The average execution time is "+average+" ms.\n");
	IJ.log("The average used memory is "+avg_mem.toFixed(2)+" MB.\n");
}

IJ.log("End of benchmark\n");




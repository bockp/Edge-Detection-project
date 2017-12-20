//Author : Cecilia Ostertag

function benchmark(img,timeList)
{
	var startTime,endTime,time,memory;

 	startTime = Date.now();
	func = prewitt();
	func(img.getRaster());
	endTime = Date.now();	
	time = endTime - startTime;
	 //memory currently being used by ImageJ
	timeList.push(time);
	//memoryList.push(memory/1048576);//convert bytes to MB
}

function runBenchmark(pixels,dim)
{
	console.log("Front loading...\n");
	//------------------------------------FRONT-LOADING------------------------------

	//front-load 5 times without saving the returned timing
	var timeList=[],memoryList=[];
	for(var i = 0; i<5; i++){

		let img = new T.Image('uint8',dim,dim);
		img.setPixels(pixels);
		benchmark(img,timeList);

		if (i===0)
		{
			console.log("first results :\n");
			console.log("time: "+timeList[i]);
			console.log("memory: "+memoryList[i]);
		}
	
	}

	//------------------------------------BENCHMARKING------------------------------


		timeList = []; 
		memoryLsit = [];
		var loops = 10;
		for(var j = 0; j < loops; j++){
			console.log("j=",j);
			let img = new T.Image('uint8',dim,dim);
			img.setPixels(pixels);
			benchmark(img,timeList);
		}

	console.log("End of benchmark\n");
	console.log("prewitt_"+dim+"\t"+timeList.join("\nprewitt_"+dim+"\t"));
}

// Main program

imgList=[Lenna_128,Lenna_256,Lenna_512,Lenna_1024,Lenna_2048];
dimsList=[128,256,512,1024,2048];

//LoG(9,1.4) , canny(10.0,40.0,2.0)


for (var i=0; i<imgList.length; i++)
{
	runBenchmark(imgList[i],dimsList[i]);
}



//runBenchmark(imp, functionNames[4], parametersList[4]);

//Authors : Peter Bock, Cecilia Ostertag

function benchmark(img,timeList)
{
	var startTime,endTime,time,memory;

 	startTime = Date.now();
	func = canny(10.0,40.0,2.0);//sobel() , prewitt(), robertscross(), LoG(9,1.4), canny(10.0,40.0,2.0);
	func(img.getRaster());
	endTime = Date.now();	
	time = endTime - startTime;
	 //memory currently being used by ImageJ
	timeList.push(time);
	//memoryList.push(memory/1048576);//convert bytes to MB
}

function runBenchmark(pixels,W,H)
{
	console.log("Front loading...\n");
	//------------------------------------FRONT-LOADING------------------------------

	//front-load 5 times without saving the returned timing
	var timeList=[],memoryList=[];
	for(var i = 0; i<5; i++){

		let img = new T.Image('uint8',W,H);
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
			let img = new T.Image('uint8',W,H);
			img.setPixels(pixels);
			benchmark(img,timeList);
		}

	console.log("End of benchmark\n");
	console.log("canny_"+W+"\t"+timeList.join("\ncanny_"+W+"\t"));
}

// Main program

imgList=[coins_128,coins_128,coins_300,coins_300,coins_512,coins_512,coins_1024,coins_1024,coins_2048,coins_2048];
dimsList=[128,105,300,246,512,420,1024,840,2048,1679];

//LoG(9,1.4) , canny(10.0,40.0,2.0)


for (var i=0; i<dimsList.length; i+=2)
{
	pixels=imgList[i];
	W=dimsList[i];
	H=dimsList[i+1];
	//pixels=imgList[i].map ( (px) => px * 256); //uint16
	//pixels=imgList[i].map( (px) => px/128.0 - 1.0); //float32
	runBenchmark(pixels,W,H);
}



//runBenchmark(imp, functionNames[4], parametersList[4]);

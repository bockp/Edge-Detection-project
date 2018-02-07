//Author : Cecilia Ostertag

function benchmark(img,timeList,gpuEnv,times1,times2,times3,times4,times5)
{
	var startTime,endTime,time;

 	startTime = Date.now();
	func = gpuEdgeCanny(50,100,times1,times2,times3,times4,times5);
	func(img.getRaster(),gpuEnv);
	endTime = Date.now();	
	time = endTime - startTime;
	timeList.push(time);
}

function runBenchmark(pixels,W,H,gpuEnv)
{
	console.log("Front loading...\n");
	//------------------------------------FRONT-LOADING------------------------------

	//front-load 5 times without saving the returned timing
	var timeList=[],memoryList=[];
	for(var i = 0; i<5; i++){

		let img = new T.Image('uint8',W,H);
		img.setPixels(pixels);
		benchmark(img,timeList,gpuEnv);

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
			benchmark(img,timeList,gpuEnv);
		}

	console.log("End of benchmark\n");
	console.log("canny_"+W+"\t"+timeList.join("\ncanny_"+W+"\t"));
}

// Main program

let imgList=[coins_128,coins_128,coins_300,coins_300,coins_512,coins_512,coins_1024,coins_1024,coins_2048,coins_2048];
let dimsList=[128,105,300,246,512,420,1024,840,2048,1679];
let gpuEnv = gpu.getGraphicsContext("preview");

for (var i=0; i<imgList.length; i+=2)
{
	pixels = new Uint8Array(imgList[i]);
	W=dimsList[i];
	H=dimsList[i+1];
	runBenchmark(pixels,W,H,gpuEnv);
}
    


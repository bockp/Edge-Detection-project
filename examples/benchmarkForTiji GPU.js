//Author : Cecilia Ostertag

function benchmark(img,timeList)
{
	var startTime,endTime,time,memory;

 	startTime = Date.now();
	func = canny(50,100);
	func(img.getRaster());
	endTime = Date.now();	
	time = endTime - startTime;
	timeList.push(time);
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
	console.log("canny_"+dim+"\t"+timeList.join("\ncanny_"+dim+"\t"));
}

// Main program

imgList=[Lenna_128,Lenna_256,Lenna_512,Lenna_1024,Lenna_2048];
dimsList=[128,256,512,1024,2048];


for (var i=0; i<imgList.length; i++)
{
	runBenchmark(imgList[i],dimsList[i]);
}

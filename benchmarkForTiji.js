//Authors : Peter Bock, Cecilia Ostertag

function benchmark(img,timeList)
{
	var startTime,endTime,time,memory;

 	startTime = Date.now();
	func = sobel();//sobel() , prewitt(), robertscross(), LoG(9,1.4), canny(10.0,40.0,2.0);
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

		let img = new T.Image('float32',dim,dim);
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
			let img = new T.Image('float32',dim,dim);
			img.setPixels(pixels);
			benchmark(img,timeList);
		}

	console.log("End of benchmark\n");
	console.log("sobel_"+dim+"\t"+timeList.join("\nsobel_"+dim+"\t"));
}

// Main program

imgList=[Lenna_128,Lenna_256,Lenna_512,Lenna_1024,Lenna_2048];
dimsList=[128,256,512,1024,2048];

//LoG(9,1.4) , canny(10.0,40.0,2.0)


for (var i=0; i<imgList.length; i++)
{
	//pixels=imgList[i].map ( (px) => px * 256); //uint16
	pixels=imgList[i].map( (px) => px/128.0 - 1.0); //float32
	runBenchmark(pixels,dimsList[i]);
}



//runBenchmark(imp, functionNames[4], parametersList[4]);

class NoiseMaker {
    constructor(canvas){
	this.canvas = canvas;
    }

    draw(thresh){

	var thresh = thresh || 0.5;
	var context = this.canvas.getContext("2d");
	console.log("canvas", this.canvas.width, this.canvas.height);

	var x, y;
	context.filter = 'blur(1px)';
	context.fillStyle = "rgba(255,255,255,0.8)";
	
	for (var x = 0; x < this.canvas.width; x++){
	    for (var y = 0; y < this.canvas.height; y+=5){
		// if (Math.random() > thresh) { continue; }
		// if (x % 2 === 0 && y %2 !== 0 ){ continue }
		context.fillRect(x, y, 1, 1);
	    }
	}

	context.filter = "none";
    }
}

export { NoiseMaker };

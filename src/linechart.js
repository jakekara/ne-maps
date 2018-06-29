import * as d3 from "d3";
import { Plot } from "./plot.js";
import { addAccessor } from "./accessor.js";
import { BarChart } from "./barchart.js";

/** Class representing a line cahrt */
class LineChart extends BarChart {


    initiateScales(){
    	this.plot.xScale = d3.scalePoint();	
    	this.plot.yScale = d3.scaleLinear();
    }
    
    // constructor(plot){
    // 	super(plot)

    // 	// TODO - Integrate this up into chartparts
    // 	this.plot.xScale = d3.scaleLinear();

    // 	console.log("xScale override", this.plot.xScale);
    // }

    points(){

	var x = a => a[this.labelKey()];
	var y = a => a[this.valueKey()];
	    
	return this.data().map(function (a){
	    return {
		"x":x(a),
		"y":y(a)
	    }
	});

    }

    draw(){
	this.predraw();
	
	var that = this;
	const line = d3.line()
	      .x( d => that.plot.xScale(d.x) )
	      .y( d => that.plot.yScale(d.y) );

	this.linePath = this.linePath || this.plot.svg.append("path");

	this.linePath
	    .transition().duration(this.duration())
	    .attr("d", line(this.points()));

	console.log("points", this.points());

	return this;
	
    }
}


//     constructor(plot){	

// 	this.plot = plot;
// 	addAccessor(this, "points", "__points", []);
// 	addAccessor(this, "duration", "__duration", []);	

// 	// addAccessor(this, "linePath", "__line_path");
//     }

//     draw(){

// 	this.plot.draw();

// 	var that = this;
// 	const line = d3.line()
// 	      .x( d => that.plot.xScale(d.x) )
// 	      .y( d => that.plot.yScale(d.y) );

// 	this.linePath = this.linePath || this.plot.svg.append("path");

// 	this.linePath
// 	    .transition().duration(this.duration())
// 	    .attr("d", line(this.points()));

// 	return this;

//     }
// }

export { LineChart };

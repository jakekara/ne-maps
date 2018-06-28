import * as d3 from "d3";
// var d3 = Object.assign({},
// 		       require("d3-scale"),
// 		       require("d3-selection")
// 		      );

import { addAccessor } from "./accessor.js"; 

/** Class representing a plot */
class Plot{

    /** 
     * Create a plot 
     */
    constructor(){

	addAccessor(this, "height", "__height", 100);
	addAccessor(this, "width", "__width", 100);
	addAccessor(this, "container", "__container");
	addAccessor(this, "margin", "__margin",
		    {
			"top":4,
			"left":4,
			"right":9,
			"bottom":0
		    });
	addAccessor(this, "safeArea", "__safe_area", this.margin());

	// set up some defaults for a scatter plot of values from 1 to 100
	this.xScale = d3.scaleLinear().range(this.width());
	this.yScale = d3.scaleLinear().range(this.height());
    	this.xDomain = d3.range(1,100); 
    	this.yDomain = (new Array(100)).map(() => d3.randomUniform(1, 100));
    }

    draw(){

	this.svg = this.svg || this.container().append("svg");
	this.svg.attr("height",this.height())
	this.svg.attr("width", this.width())

	this.safeArea(Object.assign({}, this.margin()));	
	return this;
    }

    redraw(){
	this.svg = undefined;
	this.draw();
    }

}

export { Plot };

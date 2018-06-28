import * as d3 from "d3";
import { Plot } from "./plot.js"

/** Class representing a plot with a left/bottom x and y axis */
class XYPlot extends Plot {

    constructor(...args){
	
	super(...args);

    }

    draw() {

	// plot adds svg
	super.draw();

	this.drawAxes();

	// update the safe area so drawing is within axis
	var safeArea = this.safeArea();

	safeArea.left += this.yAxisEl.node().getBBox().width;
	safeArea.bottom += this.xAxisEl.node().getBBox().height;
	
	this.safeArea(safeArea);
	    
	return this;
    }

    createAxisElements() {
	this.xAxisEl = this.xAxisEl || this.svg.append("g")
	    .classed("xaxis", true);
	
	this.yAxisEl = this.yAxisEl || this.svg.append("g")
	    .classed("yaxis", true);
    }

    xAxisGenerator(xscale){
	return d3.axisBottom(xscale);	
    }

    yAxisGenerator(yscale){
	return d3.axisLeft(yscale);
    }
    
    renderAxisElements() {

	// var xscale = this.xScale.domain(this.xDomain);
	// var yscale = this.yScale.domain(this.yDomain);
	var xscale = this.xScale;
	var yscale = this.yScale;
	
	var xaxis = this.xAxisGenerator(xscale);
	var yaxis = this.yAxisGenerator(yscale);

	// add the elements so we can get important size information
	this.xAxisEl.call(xaxis);
	this.yAxisEl.call(yaxis);

	yscale.range([this.height()
		      - this.margin().bottom
		      - this.xAxisEl.node().getBBox().height,
		      this.margin().top]);
	
	xscale.range([
	    this.margin().left
	    	+ this.yAxisEl.node().getBBox().width,
	    this.width()
	    	- this.margin().right]);

	// update the scales
	// this.xScale = xscale;
	// this.yScale = yscale;

	this.xAxisEl.call(xaxis);
	this.yAxisEl.call(yaxis);

	// calculate the transforms
	const xAxisYOffset = this.height()
	      - this.xAxisEl.node().getBBox().height
	      - this.margin().bottom;

	const yAxisXOffset = this.margin().left 
	      + this.yAxisEl.node().getBBox().width
	      // + this.margin().left;

	// helper function for writing svg translates
	const translate = (x, y) => "translate(" + x + ", " + y + ")";

	// console.log("offsets",
	// 	    xAxisYOffset,
	// 	    yAxisXOffset);
		   //  this.yAxisEl.node().getBBox().width,		    
		   //  this.safeArea(),
		   //  this.margin(),
		   //  // this.xAxisEl.node().getBBox().height,

		   // );

	this.xAxisEl.attr("transform", translate(0, xAxisYOffset));
	this.yAxisEl.attr("transform", translate(yAxisXOffset, 0));
	// console.log("OK");
    }

    drawAxes() {
	this.createAxisElements();
	this.renderAxisElements();
    }
    
}

export { XYPlot };



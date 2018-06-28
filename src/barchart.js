
import * as d3 from "d3";
import { Plot } from "./plot.js";
import { DataArray } from "./data.js";
import { addAccessors } from "./accessor.js"; 

/** Class representing a bar chart (techincally a column chart) */
class BarChart {

    constructor(plot){

	this.plot = plot;
	this.plot.xScale = d3.scaleBand();
	
	addAccessors(this,
		     [
			 {name:"labelKey",def:"label"},
			 {name:"valueKey",def:"value"},
			 {name:"duration",def:0},
			 {name:"animate",def:false},
			 {name:"data", def:[]},
			 {name:"ymax",def:null},
		     ]);

    }
    
    labels() {
	return this.data().map(a => a[this.labelKey()]);
    }

    values(){
	return this.data().map(a => Number(a[this.valueKey()]));
    }

    /** get the index of the bar from mouse coordinates tuple */
    getBarIndexFromCoords(coords){
	return Math.round((
	    coords[0]
	    // - this.plot.margin().left
		- this.plot.safeArea().left
		// - this.plot.yAxisEl.node().getBBox().width
	) / this.plot.xScale.bandwidth());
    }

    /** return the ith bar as a d3 selection (zero-index) */
    getBarAtIndex(i){
	return 	this.plotArea.select("rect:nth-child(" + ( i + 1) + ")");
    }

    /** return all of the bars as a d3 selection */
    getAllBars(){
	// return this.bars;
	return this.plotArea.selectAll("rect.bar");
    }

    // helper functions to be used for for drawing bars using general
    // update pattern
    drawBarsRemoveOld(){
    }

    drawBarsUpdateCurrent(){
    }

    drawBarsAddNew(){
    }

    drawBars(){

	this.bars = this.plotArea.selectAll(".bar")
	    .data(this.data());

	// exit
	const old = this.bars.exit()
	      // .transition()
	      // .duration(this.duration())
	      .remove()

	// update
	var that = this;
	
	const barX = function(d){
	    return that.plot.xScale(d[that.labelKey()]);
	}

	const barWidth = function(){
	    return  that.plot.xScale.bandwidth(); };

	const barY = function(d){
	    return that.plot.yScale(d[that.valueKey()]);
	}

	const barHeight = function(d){

	    var ret =  that.plot.height()
	    // - that.plot.margin().bottom
	    // - that.plot.xAxisEl.node().getBBox().height
		- that.plot.safeArea().bottom
		- barY(d);

	    return ret;
	}


	// update
	this.bars
	    .transition()
	    .duration(this.duration())
	    .attr("height", barHeight)
	    .attr("width", barWidth)
	    .attr("x", barX)
	    .attr("y", barY)

	// add new
	this.bars.enter()
	    .append("rect")
	    .classed("bar", true)
	    .attr("height", barHeight)
	    .attr("width", barWidth)
	    .attr("x", barX)
	    .attr("y", barY)
    }

    initiateScales(){
	this.plot.xScale = d3.scaleBand();
	this.plot.yScale = d3.scaleLinear();
    }

    updateRanges(){
	this.plot.xScale
	    .range([this.plot.safeArea().left,
		    this.plot.width()
		    - this.plot.safeArea().right])

	this.plot.yScale
	    .range([this.plot.height()
		    - this.plot.safeArea().bottom,
		    this.plot.safeArea().top])
	
    }

    updateDomains(){
	this.plot.xScale
	    .domain(this.labels());

	this.plot.yScale
	    .domain( [0, this.ymax() || d3.max(this.values())])

	// this.plot.xDomain = this.labels();
	// this.plot.yDomain = [0, this.ymax() || d3.max(this.values())];
	
    }

    predraw(){

	this.initiateScales();
	
	this.updateDomains();

	this.plot.draw();

	this.updateRanges();

	
    }

    draw(){
	this.predraw();

	this.plotArea = this.plotArea || this.plot.svg.append("g");
	
	this.drawBars();

	return this;

    }
}

export { BarChart };

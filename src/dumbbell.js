// dumbbell plots - horizontal lines with a label at each end, a
// throughline, and circles to represent values

import * as d3 from "d3";
import { addAccessor } from "./accessor.js";

class Bell {

    constructor(){
	addAccessor(this, "container", "__container");
	addAccessor(this, "leftLabel", "__left_label", "");
	addAccessor(this, "rightLabel", "__right_label", "");
	addAccessor(this, "values", "__values", []);
	addAccessor(this, "colors", "__colors", _ => "#999");
	addAccessor(this, "scale", "__scale");
	addAccessor(this, "height", "__height");
	addAccessor(this, "radius", "__radius", 5);
	addAccessor(this, "hoverCallback", "__hover_callback", _ => null);
	addAccessor(this, "hoverEndCallback", "__hover_end_callback", _ => null);	
    }

    // height(){
    // 	return this.container().node().getBoundingClientRect().height;
    // }

    width(){
	return this.container().node().getBoundingClientRect().width;
    }
    
    draw(){
	// Add throughline
	console.log("Drawing", this.leftLabel(), " plot ", this.container());

	this.svg = this.container()
	    .append("svg")
	    .attr("height", this.height() + "px")
	    .attr("width", this.width() + "px");

	this.throughLine = this.svg
	    .append("line")
	    .classed("throughline", true)
	    .attr("x1", this.scale()(0))
	    .attr("y1", this.height() / 2)
	    .attr("x2", this.scale()(this.scale().domain()[1]))
	    .attr("y2", this.height() / 2)

	var scale = this.scale();
	var colors = this.colors();
	console.log("height", this.height());
	
	// console.log("Found values", this.values())
	// Add circles
	this.circles = this.svg.append("g")
	    .classed("circle-group", true)
	    .selectAll("circle")
	    .data(this.values())
	    .enter()
	    .append("circle")
	    .attr("cy", this.height() / 2)
	// .attr("cx", this.width() / 2) // temporary
	    .attr("cx", d => scale(d.value))
	    .attr("r", Math.min(this.height() / 2,
			      this.radius()))
	    .attr("fill", d => colors(d))

	this.circles.on("mouseover", this.hoverCallback());
	this.circles.on("mouseout", this.hoverEndCallback());

	console.log("scale", this.scale())	
    }
}

class DumbbellPlot {

    constructor(){

	// addAccessor(this, "height", "__height", 100);
	addAccessor(this, "width", "__width", 100);
	addAccessor(this, "container", "__container");
	addAccessor(this, "scale", "__scale");
	addAccessor(this, "bells", "__bells");
	
    }
    
    drawAxis(){
    }

    drawBells(){
    }

    draw(){

	// Add an svg
	// this.svg = this.container().append("svg")
	//     .attr("width", this.width());


	// Create a table with a row and three cells for each bell
	this.table = this.container().append("table").classed("dumbbell-plot", true);
	this.rows = this.table.selectAll("tr")
	    .data(this.bells())
	    .enter()
	    .append("tr")

	this.leftLabels = this.rows.append("td")
	    .classed("label", true)
	    .classed("left", true)
	    .text(function(d){ return d.leftLabel(); })

	this.plots = this.rows.append("td")
	    .classed("plot", true)

	this.rightLabels = this.rows.append("td")
	    .classed("label", true)
	    .classed("right", true)
	    .text(d => d.rightLabel());

	var scale = this.scale()

	var height = 0;


	var that = this;
	var hoverCallback = function(d, i){


	    var cssSel = ".right.label:nth-child(" + (i + 1) + ")";

	    console.log("hover", i, i+1, cssSel, d);	    

	    var el = d3.select(cssSel)
	    console.log("el", el)

	    el.text(Math.round(d.value));
	}

	var hoverEndCallback = function(d, i){
	    // that.rightLabels.select("td:nth-child(" + (i + 1) + ")")
	    // 	.text("");
	}
	
	// Draw each plot
	this.plots
	    .attr("width", this.width())
	    .each(function(d, i){
		height = this.getBoundingClientRect().height;
		d.container.call(d, d3.select(this));
		d.scale.call(d, scale);
		d.height.call(d, height);
		// d.hoverCallback(a => hoverCallback( a, i));
		// d.hoverEndCallback(a => hoverEndCallback(a, i));			
		d.draw.call(d);

	    });

	// Add axis
	this.axisRow = this.table.append("tr")
	this.axisRow.append("td")
	this.scaleCell = this.axisRow.append("td")
	this.axisRow.append("td")

	this.scaleSvg = this.scaleCell.append("svg")
	    .attr("height", 20);
	
	var axis = d3.axisBottom()
	    .scale(scale)
	    .tickValues([0, 800, 1600])
	
	this.scaleSvg.call(axis);

	// Add a legend
	this.legendCell = this.table.append("tr")
	    .append("td")
	    .attr("colspan",3);

	this.legendItems = this.legendCell.selectAll(".legend-item")
	    .data(this.bells()[0].values())
	    .enter()
	    .append("div")
	    .classed("legend-item", true)

	this.legendBoxes = this.legendItems.append("div")
	    .classed("legend-box", true)
	    .style("background-color", function(d){
		return d.color;
	    });

	this.legendLabels = this.legendItems.append("div")
	    .classed("legend-label", true)
	    .text(d => d.label);
	    
    }
    
}


export { DumbbellPlot, Bell };

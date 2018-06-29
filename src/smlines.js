// Small timeline

import * as d3 from "d3";
import * as numeral from "numeraljs";
import { LineChart } from "./linechart.js";
import { XYPlot  } from "./xyplot.js";

var colors = {
    "Black/African American":d3.interpolateBuPu(1),
    "Hispanic/Latino":d3.interpolateBuPu(0.5),
    "White":d3.interpolateBuPu(0.25),	
}

function drawChart(data, container){

    var plot = new XYPlot().container(d3.select(container)).width(85).height(85);
    var margin = plot.margin()
    margin.right += 3;
    plot.margin(margin)

    

    var lineData = function(line){
	var y;
	var ret = [];
	
	for (y=2008; y < 2016; y++){
	    ret.push({
		"x":y,
		"y":Number(line[y])
	    })
	}

	return ret;
    }

    data.forEach(function(line){
	var d = lineData(line);

	var ylim = 80;
	var chart = new LineChart(plot)
	    .labelKey("x")
	    .valueKey("y")
	    .ymax(ylim)
	    .data(d);

	plot.yAxisGenerator = function(scale){
	    return d3.axisLeft(scale)
		.tickValues([0, ylim/2, ylim]);
	}

	plot.xAxisGenerator = function(scale){
	    return d3.axisBottom(scale)
		// .tickFormat(function(d, i){
		//     return numeral(d).format("0");
		// })
		.tickValues(d3.extent(scale.domain()));
	}

	chart.draw();

	chart.linePath
	    .classed("plot", true)
	    .attr("stroke", colors[line["race"]])
	    .attr("data-race", line["race"])
	
    })

}
function drawWithData(data){

    var container = d3.select("#container")
	.append("div")
	.classed("center-graphic", true);

    var title = container.append("h7")
	.text("HIV diagnosis rates")

    var explainer = container.append("p")
	.classed("small-text", true)
	.text("The number of people diagnosed with HIV each year "
	      + " continues to decline but varies greatly "
	      + " by race. The rates below are adjusted per 100,000 population. "
	      + " The Northern New England states of Maine, New Hampshire and "
	      + " Vermont are more sporadic because they have much smaller "
	      + " and whiter populations. A single black person diagnosed with "
	      + " HIV can send Maine's per-100,000 rate up by 7 points for the year."
	      + " About 90 percent of HIV cases in New England are in the southern "
	      + " states of Connecticut, Rhode Island and Massachusetts.")
    
    var smContainer = container.append("div")
	.classed("small-multiple-container", true);;

    var sourceline = container.append("div")
	.classed("sourceline", true)
	.text("SOURCE: Centers for Disease Control");

    var stateData = {};

    data.forEach(function(d){
	if (! (d.Geography in stateData)) {
	    stateData[d.Geography] = [];
	}

	stateData[d.Geography].push(d);
    });

    var boxes = smContainer.selectAll(".small-chart")
	.data(Object.keys(stateData))
	.enter()
	.append("div")
	.classed("small-chart", true)
	.classed("line-chart", true)
	.attr("data-geography", d => d)

    var legend_container = smContainer.append("div")
	.classed("small-chart", true)
	.classed("legend-container", true)
    var legend_items = legend_container.selectAll(".legend-item")
	.data(Object.keys(colors))
	.enter()
	.append("div")
	.classed("legend-item", true)

    var legend_boxes = legend_items.append("div")
	.classed("legend-box", true)
	.style("background-color", function(d){
	    return colors[d];
	})

    var legen_labels = legend_items.append("div")
	.classed("legend-label", true)
	.text(d => d);

    var titles = boxes.append("div")
	.classed("title", true)
	.text(d => d)

    var plots = boxes.append("div")

    plots.each(function(d){
	drawChart(stateData[d], this);
    });
}

d3.csv("data/small-timelines.csv")
    .then(function(data){
	drawWithData(data);
    });


// Small timeline

import * as d3 from "d3";
// import * as numeral from "numeraljs";
import { BarChart } from "./barchart.js";
import { XYPlot  } from "./xyplot.js";

var colors = {
    "Injection drug use":d3.interpolateBuPu(0.25),
    "Heterosexual contact":d3.interpolateBuPu(0.5),    
    "Male-to-male sexual contact":d3.interpolateBuPu(1),
}

function drawChart(data, container){

    var plot = new XYPlot()
	.container(d3.select(container))
	.width(85)
	.height(85);

    var data = data
	.map(function(d){
	    return {
		"label":d["transmission-overall"],
		"value":Number(d["2016"])
	    }
	})
	.filter(function(d){
	    console.log("filter", d);
	    var ret = d["label"] in colors;
	    console.log("returning", ret);
	    return ret;
	});

    console.log("making chart with data", data);

    var chart = new BarChart(plot)
	.data(data);

    plot.yAxisGenerator = function(scale){
    	return d3.axisLeft(scale)
    	    .tickValues(d3.extent(scale.domain()))
	    .tickFormat(d3.format(".2s"))
    	    .tickFormat(function(d, i){
		var fmt = ".2s";
		if ((Number(d) < 10)) fmt = ".1s";
		return d3.format(fmt)(d);
	    })
    	    // 	return numeral(d).format("0a").toUpperCase();
    	    // 	// d3.format(".1s"));
    	    // });
    	// .tickValues([0, ylim/2, ylim]);
    }

    plot.xAxisGenerator = function(scale){
    	return d3.axisBottom(scale)
    	    .tickValues([]);
    }
    
    chart.draw();

    chart.plotArea.selectAll("rect")
	.style("fill", function(d, i){
	    var label = data[i]["label"];
	
	    console.log("chart.bars.style", label, i);
	
	    return colors[label];
    });


    // data.forEach(function(line){
    // 	var d = lineData(line);
    // 	console.log("Drawing line with data", d);


    // 	// chart.linePath
    // 	//     .classed("plot", true)
    // 	//     .attr("stroke", colors[line["race"]])
    // 	//     .attr("data-race", line["race"])
	
    // })

}
function drawWithData(data){

    console.log("drawing with data", data);

    var container = d3.select("#container")
	.append("div")
	.classed("center-graphic", true);

    var title = container.append("h7")
	.text("Most diagnoses come from from male-to-male sexual contact")

    var explainer = container.append("p")
	.classed("small-text", true)
	.text("Male-to-male sexual contact accounted for the largest portion "
	      + " of diagnoses, compared with other manners of transmission. ")

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

    console.log(stateData);

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
	console.log("plots.each", d);
	drawChart(stateData[d], this);
    });
}

d3.csv("data/transmission-2016.csv")
    .then(function(data){
	drawWithData(data);
    });


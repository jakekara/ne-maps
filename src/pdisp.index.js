import * as d3 from "d3";
import { DumbbellPlot, Bell } from "./dumbbell.js";

d3.csv("data/bhw-prev-2015.csv")
    .then(function(data){

	console.log("Prevalence data");

	console.log( DumbbellPlot );

	var width = 100,
	    padding = 6,
	    maxVal = 1600;

	var container = d3.select("#container");

	container.append("h7")
	    .text("HIV prevalence")

	container.append("p")
	    .classed("small-text", true)
	    .text("The number of adults and adolescents living with HIV per 100,000 population in 2015.");

	var dbContainer = container.append("div");

	var d = new DumbbellPlot()
	    .container(dbContainer)
	    .scale(d3.scaleLinear()
		   .domain([0, maxVal])
		   .range([0 + padding, width - padding]))
	    .width(width)
	    .bells(data.map(function(d){
		var ret = new Bell()
		ret.values([
		    {"value":Number(d.white),
		     "label":"White",
		     "color":d3.interpolateBuPu(0.25)},
		    {"value":Number(d.hispanic),
		     "label":"Hispanic/Latino",
		     "color": d3.interpolateBuPu(0.5)},
		    {"value":Number(d.black),
		     "label":"Black/African American",
		     "color":d3.interpolateBuPu(1)}
		    
		]);
		ret.colors(function(d){ return d.color });
		ret.leftLabel(d.ap)
		// ret.rightLabel(Math.round(d.hispanic / d.white));
		return ret;
	    }))
	    .width(100)
	    // .height(100)
	    .draw()
	
    });

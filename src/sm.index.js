// small multiple choropleth to show prevalence rates by state and race

import { Choropleth } from "./choropleth.js";
import * as d3 from  "d3";
import * as topojson from "topojson";
import { usProjection, objectSubset } from "./topo-helper.js";
import { isNewEnglandFips } from "./new-england.js";


var drawWithData = function(args){

	const topodata = args[0],
	      data = args[1];

	const width = window.innerWidth,
	      height = width * 1.5;

	// determine the max value
	const max_value = d3.max([d3.max(data.map(a => Number(a.black))),
				d3.max(data.map(a => Number(a.hispanic))),
				d3.max(data.map(a => Number(a.white)))]);

	// Determine the next value rounded up 100
	const round_max = Math.round(max_value / 100) * 100

	// Generate a scale
	const valueScale = function(range){
	    return d3.scaleLinear()
		.domain([0, round_max])
		.range(range);
	}

	const colorFunc = d3.interpolateBuPu;
	
	const color = function(v){
	    var ret = colorFunc(valueScale([0,1])(v));
	    return ret
	}

    const container = d3.select("#container").html("");


    var mapBox = container.append("div")
	.classed("side-by-side", true);

    var legend_container = container.append("div")
	.classed("choropleth-legend", true)
    
    const legend_width = legend_container.node().getBoundingClientRect().width,
	      legend_height = 40,
	      legend_padding = 20,
	      legend_steps = Math.max(100, width / 4),
	      legend_step_width = (legend_width - legend_padding * 2) / legend_steps;

	// Draw the choropleths

	function drawChoropleth(container, col, label, idCol){

	    var newEnglandFilter = function(d){
		return isNewEnglandFips(d.id.slice(0,2));
	    }

	    var cwidth = Math.min(width / 3, 200),
		cheight = cwidth * 1.3;

	    var neProjection = d3.geoMercator()
		.fitSize([cwidth, cheight],
			 topojson.mesh(topodata,
				       topodata.objects.counties,
				       newEnglandFilter))
	    

	    container.append("div")
		.classed("title", true)
		.text(label);
	    
	    var c = new Choropleth()
		.width(cwidth)
		.height(cheight)
		.projection(neProjection)
		.container(container.append("div"))
		.subset(objectSubset(
		    topodata,
		    topodata.objects.states,
		    newEnglandFilter
		))
		.colorContext(function(c, d){

		    c.strokeStyle = "white";

		    var objectColor = "white";

		    var objectId = d.id;
		    var matches = data.filter(function(a){
			return a.fips === d.id;
		    });

		    if (matches.length === 1){
			objectColor = color(matches[0][col]);
		    }
		    

		    c.fillStyle = objectColor;
		    
		    c.lineWidth = 2;
		    return c;
		})
		.init()
		.drawChoropleth();

	}

	drawChoropleth(
	    mapBox.append("div")
		.classed("choropleth", true),
	    "white",
	    "White");

	drawChoropleth(
	    mapBox.append("div")
		.classed("choropleth", true),
	    "hispanic",
	    "Hisp./Latino");

	drawChoropleth(
	    mapBox.append("div")
		.classed("choropleth", true),
	    "black",
	    "Black");
	
	

	// Draw the color legend
    // var legend_container = container.append("div")
    // 	.classed("choropleth-legend", true)

    legend_container.append("div")
	.classed("legend-title", true)
	    .text("Rate per 100,000");
	
	var legend_svg = legend_container.append("svg")
	    .classed("map-legend", true)
	    .attr("height", legend_height + "px")
	    .attr("width", legend_width + "px");

	// Add the color rectangles
	var rects = legend_svg.append("g").selectAll("rect")
	    .data(d3.range(0, legend_steps))
	    .enter()
	    .append("rect")
	    .style("fill", x => color)
	    .attr("width", legend_step_width)
	    .attr("height", legend_height / 2)
	    .attr("x", function(v, i){
		return legend_padding + (i * legend_step_width); 
	    })
	    .attr("fill", function(v, i){
		return color((v / legend_steps) * round_max);
	    })
	    .attr("stroke", function(v, i){
		return color((v / legend_steps) * round_max);
	    });

	// Create the axis
	var legend_axis = d3.axisBottom()
	    .tickSize(legend_height / 2)
	    // .ticks(Math.min(Math.round(width / 50), 6))
	    // .tickValues(d3.range(0, 1600, 200))
	    .scale(valueScale([legend_padding, legend_width - legend_padding]))

	legend_svg.append("g")
	    .call(legend_axis)
	    // .attr("transform","translate(0," + legend_height / 2 + ")");

	
	

	// Draw three state-level choropleths with outlines

}

Promise.all([d3.json("shapes/us-2017.json"),
	     d3.csv("data/bhw-prev-2015.csv")])
    .then(function(args){

	var width = window.innerWidth;

	var timeout;

	d3.select(window).on("resize", function(){
	    if (window.innerWidth === width){ return }


	    clearTimeout(timeout);
	    timeout = setTimeout(function(){
		drawWithData(args);
	    }, 100);

	    width = window.innerWidth;
	    
	});

	drawWithData(args);
	
    });

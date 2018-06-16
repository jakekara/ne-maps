// import { InteractiveMap } from "./interactive-map.js";
import { Choropleth } from "./choropleth.js";
import * as d3 from  "d3";
import * as topojson from "topojson";
import { NoiseMaker } from "./noisemaker.js";
import { usProjection, objectSubset } from "./topo-helper.js";
import { isNewEnglandFips } from "./new-england.js";

console.log("Hello, from index.js!");

d3.json("shapes/us-2017.json")
    .then(function(topodata){

	console.log("topodata", topodata);	

	var width = 300,
	    height = width * 1.34;

	var counties = topodata.objects.counties// cb_2017_us_county_20m;
	var states = topodata.objects.states

	var newEnglandFilter = function(d){
	    return isNewEnglandFips(d.id.slice(0,2));
	}

	var allFilter = function(_){ return true; };

	// var ctFilter = function(d){ return d.properties.STATEFP === "09"; }

	var neProjection = d3.geoMercator()
	    .fitSize([width, height],
		     topojson.mesh(topodata,
				   counties,
				   newEnglandFilter));

	var outlineContext = function(c, _){
	    c.lineWidth = 2;
	    c.fillStyle = "rgba(0,0,0,0)";
	    c.strokeStyle = "white";// rgba(255,255,255,1)";
	    // c.lineWidth = 0;
	    return c;
	}

	var colorContext =  function(c, d){

	    c.lineWidth = 0.3;

	    var rand = Math.random()
	    // c.fillStyle = d3.interpolateOranges(Math.random());
	    // c.fillStyle = d3.interpolateGreys(Math.random());
	    var color =  d3.interpolateReds(rand);
	    
	    c.fillStyle = color;
	    c.strokeStyle = color;
	    
	    return c;
	    
	}

	var newEnglandCounties = objectSubset(topodata, counties, newEnglandFilter);
	var stateShapes = objectSubset(topodata, states, function(d){
	    return isNewEnglandFips(d.id.slice(0,2));
	})
	
	var c = new Choropleth()
	    .width(width)
	    .height(height)
	    .projection(neProjection)
	    .container(d3.select("#container"))
	    .subset(newEnglandCounties)
	    .colorContext(colorContext)
	    .init()	
	    .drawChoropleth();


	// var interiors = topojson.mesh(topodata, states,
	// 			      function(a, b) { return a !== b; });
	var interiors = topojson.mesh(topodata, states,
				      function(a, b) { return a !== b; });
	
	c.drawObjects([interiors], outlineContext);
	// c.drawObjects(newEnglandCounties, colorContext);

	// new NoiseMaker(c.canvas).draw(0.25);

	var message = d3.select("#container").append("div").classed("message", true);
	
	c.onMouseOver(function(countyList){
	    if (countyList.length < 1){
		message.html("");
		return;
	    }
	    message.html(countyList[0].id)// properties.NAME);
	}, newEnglandCounties);


    });

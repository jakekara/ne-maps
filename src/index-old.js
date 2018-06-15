import { Choropleth }  from "./choropleth.js";
import * as d3 from  "d3";
import * as topojson from "topojson";
import { NoiseMaker } from "./noisemaker.js";

console.log("Hello, from index.js!");

// d3.json("https://unpkg.com/us-atlas@1/us/10m.json")
d3.json("shapes/us_counties.topo.json")
    .then(function(topodata){

	console.log("topodata", topodata);	

	var width = 300;
	    // height = 500;
	var height = width * 1.4;

	var usProjection = d3.geoAlbersUsa()
	    .fitSize([width, height],
		     topojson.mesh(topodata))
	
	var ctProjection = d3.geoMercator()
	    .rotate([72.7, 0, 0])
	    .scale(width * 22)
	    .center([0, 41.52])
	    .translate([width / 2, height / 2]);
	 
	var newEnglandFips =
	    [
		"09", // CT
		"44", // RI
		"25", // MASS
		"23", // MAINE
		"33", // New Hampshire
		"50", // VERMONT
	    ];

	var counties = topodata.objects.cb_2017_us_county_20m;

	var newEnglandFilter = function(d){
	    return newEnglandFips.indexOf(d.properties.STATEFP) >= 0;
	}

	var allFilter = function(_){ return true; };

	var neProjection = d3.geoMercator()
	    .fitSize([width, height],
		     topojson.mesh(topodata,
				   counties,
				   newEnglandFilter));

	var outlineContext = function(c, _){
	    c.lineWidth = 0.3;
	    c.fillStyle = "rgba(0,0,0,0)";
	    c.strokeStyle = "rgba(125,125,125,1)";
	    c.lineWidth = 0;
	    return c;
	}

	var colorContext =  function(c, d){

	    c.lineWidth = 0.5;
	    // c.strokeStyle = "#fff";
	    c.strokeStyle = "#222";
	    c.lineWidth = 0;
	    c.fillStyle = d3.interpolateOranges(Math.random());
	    c.fillStyle = d3.interpolateGreys(Math.random());
	    c.fillStyle = d3.interpolateReds(Math.random());	    	    
	    
	    return c;
	    
	}

	var c = new Choropleth()
	    .width(width)
	    .height(height)
	    .topojson(topodata)
	    .projection(neProjection)
	    .container(d3.select("#container"));
	
	c.draw();

	c.drawOutline();	

	// c.drawObjects(topodata.objects.cb_2017_us_county_20m,
	// 	      function(a){
	// 		  return Number(a.properties.STATEFP) < 10;
	// 	      },
	// 	      outlineContext);
		      // function(c, _){
		      // 	  c.lineWidth = 0;
		      // 	  c.fillStyle = "#efefef";
		      // 	  return c;
		      // });

	
	c.drawObjects(counties, newEnglandFilter, colorContext);

	// new NoiseMaker(c.canvas).draw(0.25);

	// c.drawObjectWithId(
	//     topodata.objects.cb_2017_us_county_20m,
	//     "05099",
	//     function(c, _){
	// 	c.lineWidth = 2;
	// 	c.strokeStyle = "#000";
	// 	c.fillStyle = "#ff0000";
	// 	return c;
	//     })



	// c.colorObjectWithId(
	//     topodata.objects.cb_2017_us_county_20m,
	//     "06103",
	//     "#0044ff")



    });

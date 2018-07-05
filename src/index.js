// import { InteractiveMap } from "./interactive-map.js";
import { Choropleth } from "./choropleth.js";
import * as d3 from  "d3";
import * as topojson from "topojson";
import { NoiseMaker } from "./noisemaker.js";
import { usProjection, objectSubset } from "./topo-helper.js";
import { isNewEnglandFips } from "./new-england.js";

console.log("Hello, from index.js!");

Promise.all([d3.json("shapes/us-2017.json"),
	     d3.csv("data/us-county-prev-2014.csv")])
    .then(function(vals){

	var topodata = vals[0],
	    data = vals[1];

	var data_col = "County Rate";
	var id_col = "geo";

	// var width = window.innerWidth,
	var width = 300,
	    height = width * 1.34;

	var counties = topodata.objects.counties// cb_2017_us_county_20m;
	var states = topodata.objects.states

	var newEnglandFilter = function(d){
	    return isNewEnglandFips(d.id.slice(0,2));
	}

	var noFilter = function(_){ return true; };

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

	// get the data from the spreadsheet
	var getData = function(geoid){
	    var matches = data.filter(function(a){
		return a[id_col] === geoid;
	    });

	    if (matches.length !== 1){ return ; }
	    return matches[0];
	}

	// data = data.filter(function(a){
	//     console.log("is new england fips?", a[id_col].substring(0,2))
	//     return isNewEnglandFips(a[id_col].substring(0,2))
	// });

	var rateExtent = d3.extent(data.map( d => Number(d[data_col]) ));

	// rateExtent = [0, 500];
	// console.log("rateExtent", rateExtent);

	var rateScale = d3.scaleLinear()
	// .domain(rateExtent)
	    .domain([0, 1000])
	    .range([0,1]);

	var valScale = function(val){
	    return d3.interpolateBuPu(rateScale(val));
	    // return d3.interpolateReds(rateScale(val));
	}

	var rate = function (geoid){
	    var ret =  getData(geoid)[data_col] || "#fff";
	    return ret;
	}

	var colorContext =  function(c, d){

	    c.lineWidth = 0.3;

	    var val = Math.random()

	    // c.fillStyle = d3.interpolateOranges(Math.random());
	    // c.fillStyle = d3.interpolateGreys(Math.random());

	    var placeData = getData(d.id) || {};
	    var placeRate = Number(placeData[data_col]) || -1;

	    // var val = rateScale(placeRate);
	    // val = rateScale(500);// getRate(d.GEOID));
	    
	    // var color =  d3.interpolateReds(val);
	    var color = valScale(placeRate);

	    if (placeRate === -1){ color = "#fff"; }
	    
	    c.fillStyle = color;
	    c.strokeStyle = color;
	    
	    return c;
	    
	}

	var newEnglandCounties = objectSubset(topodata, counties, newEnglandFilter);
	var allCounties = objectSubset(topodata, counties, noFilter);
	var allStateShapes = objectSubset(topodata, states, noFilter);
	var newEnglandStateShapes = objectSubset(topodata, states, function(d){
	    return isNewEnglandFips(d.id.slice(0,2));
	})
	
	var c = new Choropleth()
	    .width(width)
	    .height(height)
	// .projection(usProjection(topodata, width, height))
	    .projection(neProjection)
	    .container(d3.select("#container"))
	// .subset(allCounties)
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
	    console.log(getData(countyList[0].id));
	}, newEnglandCounties);

	// Draw a legend
	const legend_width = width,
	      legend_steps = 100,
	      legend_height = 40;

	var legend_svg = d3.select("#container")
	    .append("svg")
	    .attr("width", legend_width)
	    .attr("height", legend_height);
	
	var legend = legend_svg
	    .append("g")
	    .classed("legend", true)
	    .attr("width", legend_width)
	    .attr("height", legend_height)
	    .attr("transform", "translate(0," + legend_height / 2 + ")")
	
	var legend_scale = d3.scaleLinear()
	    .range([10, legend_width - 10])
	// .domain([0,rateExtent[1]])
	    .domain([0, 1000]);

	var legend_axis = d3.axisBottom()
	    .scale(legend_scale)

	var legend_rects = legend_svg.append("g").selectAll("rect")
	    .data(d3.range(0,legend_steps))
	    .enter()
	    .append("rect")
	    .attr("width", legend_width / legend_steps)
	    .attr("height", legend_height / 2)
	    .attr("x", function(v, i){ return 10 +  i * ((legend_width - 20) / legend_steps);})
	    .style("fill", function(v, i){
		return d3.interpolateBuPu(i / legend_steps);
		// return  d3.interpolateReds(i / legend_steps);
	    })
	    .style("stroke", function(v, i){
		return d3.interpolateBuPu(i / legend_steps);		
		// return  d3.interpolateReds(i / legend_steps);
	    });
	
	
	legend.call(legend_axis)
	
    });

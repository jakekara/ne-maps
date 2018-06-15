import * as d3 from  "d3";
import * as topojson from "topojson";

import { addAccessor } from "./accessor.js";
console.log("Hello, from choropleth.js!");

class Map {

    constructor(){

	addAccessor(this, "container", "__container");
	addAccessor(this, "width", "__width", 100);
	addAccessor(this, "height", "__height", 100);
	addAccessor(this, "projection", "__projection", d3.geoAlbersUsa());
	
    }

    init(){
	this.container().html("");

	// retina
	var devicePixelRatio = window.devicePixelRatio || 1;

	this.canvas = this.container().append("canvas")
	    .attr("width", this.width() * devicePixelRatio)
	    .attr("height", this.height() * devicePixelRatio)
	    .style("width", this.width() + "px")
	    .style("height", this.height() + "px").node();

	this.context = this.canvas.getContext("2d");
	this.context.scale(devicePixelRatio, devicePixelRatio);

	this.path = d3.geoPath()
	    .projection(this.projection())
	    .context(this.context);

	return this;
    }

    coords(x, y){

	return this.projection().invert([x,y])
	
    }

    objectAtCoords(objects, x, y){

	var coords = this.coords(x, y);

	var ret = objects.filter(function(obj){
	    return (d3.geoContains(obj, coords));
	});

	return ret;

    }

    drawObjects(objects, context){
	
	var that = this;
	
	objects.forEach(function(d) {
	    that.context = context(that.context, d);	    
	    that.context.beginPath();
	    that.path(d);
	    that.context.fill();
	    that.context.stroke();
	});

	return this;
    }

}

export { Map };

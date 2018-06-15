import * as d3 from  "d3";
import { Map }  from "./map.js";
import { addAccessor } from "./accessor.js";

class InteractiveMap  extends Map {

    constructor(){
	super()
    }

    onMouseOver(hoverCallback, objects){
	var that = this;

	d3.select(this.canvas).on("mousemove", function(d){

	    var rect = this.getBoundingClientRect(),
		scaleX = x => x * (this.width / rect.width),
		scaleY = y => y * (this.height / rect.height),
		x = scaleX(d3.event.clientX - rect.left),
		y = scaleY(d3.event.layerY - rect.top);

	    var countyList = that.objectAtCoords(objects, x, y);
	    hoverCallback(countyList);

	})
    };
    
}

export { InteractiveMap };

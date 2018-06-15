import { InteractiveMap } from "./interactive-map.js";
import { addAccessor } from "./accessor.js";

class Choropleth extends InteractiveMap {

    constructor(){
	super()

	addAccessor(this, "colorContext", "__color_context", function(c,_){
	    c.fillStyle = "#999";
	    return c;
	});
	addAccessor(this, "subset", "__subset");
	
    }

    drawChoropleth(){
	this.drawObjects(
	    this.subset(),
	    this.colorContext()
	);
	return this;
    }
    
}

export { Choropleth }

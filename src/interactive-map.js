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
		scaleX = x => x,
		scaleY = y => y,

		// this was breaking on zoom, doesn't seen necessary
		// scaleX = x => x * (this.width / rect.width),
		// scaleY = y => y * (this.height / rect.height),
		
		x = scaleX(d3.event.clientX - rect.left),
		y = scaleY(d3.event.layerY - rect.top);

	    console.log(that.devicePixelRatio,
			this.width / rect.width,
			x, y);

	    hoverCallback(that.objectAtCoords(objects, x, y));

	})
    };
    
}

export { InteractiveMap };

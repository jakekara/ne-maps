import * as d3 from  "d3";
import * as topojson from "topojson";

function usProjection(topodata, width, height){

    return d3.geoAlbersUsa()
	.fitSize([width, height],
		 topojson.mesh(topodata))
    
}

function objectSubset (topodata, objects, filter){
    return topojson.feature(topodata, objects)
    	.features.filter(filter);
}


export { usProjection, objectSubset }

import { addAccessor } from "./accessor.js";

const DataArray = function(data){

    this.data = addAccessor(this, "data", "__data", data);
	
}

export { DataArray };

DataArray.prototype.getArrayFromKey = function(k){
    return this.data().map(a => a[k]);
}


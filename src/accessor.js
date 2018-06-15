const accessor = function(symb, v){

    if (typeof(symb) !== "undefined") {
	this[symb] = v;
    }

    return function(v){
	if (typeof(v) === "undefined") {
	    return this[symb];
	}
	this[symb] = v;
	return this;
    }
}

const addAccessor = function(context, name, symbol, v){

    context[name] = accessor.call(context, symbol, v);
}

const addDescribedAccessor = function(context, description){

    // context is required
    
    // required
    const name = description.name;

    // default symbol name
    const symbol = description.symbol || "__" + name;

    // undefined is OK
    const v = description.def;

    addAccessor(context, name, symbol, v);
    
}

const addAccessors = function(context, descriptions){

    descriptions.forEach(desc => {
	addDescribedAccessor(context, desc);
    });
    
}

export { addAccessor, addAccessors, addDescribedAccessor, accessor } 

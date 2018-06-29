const path = require('path');
const webpack = require('webpack');

// 

module.exports = {
    mode: "production",
    // "mode":"development",
    // devtool:"source-map",
    entry: {
	index:["whatwg-fetch", "babel-polyfill",'./src/index.js'],
	sm:["whatwg-fetch", "babel-polyfill",'./src/sm.index.js'],
	pdisp:["whatwg-fetch", "babel-polyfill",'./src/pdisp.index.js'],
	smlines:["whatwg-fetch", "babel-polyfill",'./src/smlines.js'],
	smbars:["whatwg-fetch", "babel-polyfill",'./src/smbars.js']
    },
    output: {
	filename: '[name]-bundle.js',
	path: path.resolve(__dirname, 'js')
    },
    module:{
    	rules: [
    	    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    	]
    },
    
};

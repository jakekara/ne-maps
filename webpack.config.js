const path = require('path');
const webpack = require('webpack');

// 

module.exports = {
    "mode":"development",
    entry: {
	index:["babel-polyfill",'./src/index.js'],
	sm:["babel-polyfill",'./src/sm.index.js'],
	pdisp:["babel-polyfill",'./src/pdisp.index.js'],
	smlines:["babel-polyfill",'./src/smlines.js'],
	smbars:["babel-polyfill",'./src/smbars.js']
    },
    output: {
	filename: '[name]-bundle.js',
	path: path.resolve(__dirname, 'js')
    }
};

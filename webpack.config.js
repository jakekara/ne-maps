const path = require('path');
const webpack = require('webpack');

module.exports = {
    "mode":"production",
    entry: {
	index:'./src/index.js',
	sm:'./src/sm.index.js',
	pdisp:'./src/pdisp.index.js',
	smlines:'./src/smlines.js',
	smbars:'./src/smbars.js'
    },
    output: {
	filename: '[name]-bundle.js',
	path: path.resolve(__dirname, 'js')
    }
};

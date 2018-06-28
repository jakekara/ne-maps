const path = require('path');
const webpack = require('webpack');

module.exports = {
    "mode":"production",
    entry: './src/sm.index.js',
    output: {
	filename: 'sm.bundle.js',
	path: path.resolve(__dirname, 'js')
    }
};

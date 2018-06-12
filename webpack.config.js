var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackOnBuildPlugin = require('on-build-webpack');
var webpack = require('webpack');
var fs = require('fs');
var nodeSass = require('node-sass');

var extractCSS = new ExtractTextPlugin('style.css');
var extractHTML = new ExtractTextPlugin('index.html');

module.exports = {
	entry: './src/app.tsx',
	output: {
		filename: 'app.js',
		path: __dirname + '/dist/application'
	},
	resolve: {
		extensions: [ '.ts', '.tsx', '.js', '.json', '.css', '.scss' ]
	},
	module: {
		rules: [
			{
				test: /tsx?$/,
				loader: 'ts-loader'
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.(s)?css$/,
				use: extractCSS.extract({
					use: [ 'css-loader', 'sass-loader' ]
				})
			},
			{
				test: /\.html?$/,
				use: extractHTML.extract({
					use: [ 'raw-loader' ]
				})
			}
		]
	},

	plugins: [ extractCSS, extractHTML ]
};

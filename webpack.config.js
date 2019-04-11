var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var production = process.argv.find(x => x === "-p");

var extractCSS = new ExtractTextPlugin("style.css");
var extractHTML = new ExtractTextPlugin("index.html");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

if (production) {
	console.log("Building for production");
}

module.exports = {
	entry: "./src/app.tsx",
	output: {
		filename: "app.js",
		path: __dirname + "/dist/application"
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json", ".css", ".scss"],
		plugins: [new TsconfigPathsPlugin({})]
	},
	mode: production ? "production" : "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			},
			{
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				test: /\.(s)?css$/,
				use: extractCSS.extract({
					use: ["css-loader", "sass-loader"]
				})
			},
			{
				test: /\.html?$/,
				use: extractHTML.extract({
					use: ["raw-loader"]
				})
			}
		]
	},

	plugins: production
		? [
				extractCSS,
				extractHTML,
				new webpack.DefinePlugin({
					"process.env.NODE_ENV": JSON.stringify("production")
				})
		  ]
		: [extractCSS, extractHTML]
};

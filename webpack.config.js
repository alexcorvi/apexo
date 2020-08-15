var webpack = require("webpack");
var production = process.argv.find((x) => x === "-p");
var fs = require("fs");
var StringReplacePlugin = require("string-replace-webpack-plugin");
var appVersion = require("./package.json").version;

var nonJSAssets = [
	"style.css",
	"apple-touch-icon.png",
	"fonts/fabric-icons-72e4a0ad.woff",
	"fonts/fabric-icons-8d8d4ac2.woff",
	"fonts/segoeui-westeuropean/segoeui-light.woff",
	"fonts/segoeui-westeuropean/segoeui-light.woff2",
	"fonts/segoeui-westeuropean/segoeui-regular.woff",
	"fonts/segoeui-westeuropean/segoeui-regular.woff2",
	"fonts/segoeui-westeuropean/segoeui-semibold.woff",
	"fonts/segoeui-westeuropean/segoeui-semibold.woff2",
	"fonts/segoeui-westeuropean/segoeui-semilight.woff",
	"fonts/segoeui-westeuropean/segoeui-semilight.woff2",
];

var processHTML = {
	apply: (compiler) => {
		compiler.hooks.afterEmit.tap("AfterEmitPlugin", (compilation) => {
			const assets = JSON.stringify(
				Object.keys(compilation.assets).concat(nonJSAssets)
			).replace(/\[|\]/g, "");
			const HTMLFile = fs.readFileSync("./src/index.html", {
				encoding: "utf8",
			});
			fs.writeFileSync(
				"./dist/application/index.html",
				HTMLFile.replace("/*ASSETS_PLACEHOLDER*/", assets)
			);
		});
	},
};

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	entry: "./src/app.tsx",
	output: {
		filename: "app.js",
		path: __dirname + "/dist/application",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json", ".css", ".scss"],
		plugins: [new TsconfigPathsPlugin({})],
	},
	externals: {
		moment: "moment",
		fs: "fs",
		path: "path",
		crypto: "crypto",
	},
	mode: production ? "production" : "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: [
					"ts-loader",
					StringReplacePlugin.replace({
						replacements: [
							{
								pattern: /--VERSION--/g,
								replacement: () => appVersion,
							},
						],
					}),
				],
			},
			{
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader",
			},
		],
	},

	plugins: production
		? [
				processHTML,
				new webpack.DefinePlugin({
					"process.env.NODE_ENV": JSON.stringify("production"),
				}),
				new StringReplacePlugin(),
				new webpack.optimize.LimitChunkCountPlugin({
					maxChunks: 5,
				}),
		  ]
		: [
				processHTML,
				new StringReplacePlugin(),
				new webpack.optimize.LimitChunkCountPlugin({
					maxChunks: 5,
				}),
		  ],
};

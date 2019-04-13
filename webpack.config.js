var webpack = require("webpack");
var production = process.argv.find(x => x === "-p");
var exec = require("child_process").exec;

var processHTML = {
	apply: compiler => {
		compiler.hooks.afterEmit.tap("AfterEmitPlugin", compilation => {
			exec(
				`cp ./src/index.html ./dist/application/index.html`,
				(err, stdout, stderr) => {
					if (stdout) process.stdout.write(stdout);
					if (stderr) process.stderr.write(stderr);
				}
			);
		});
	}
};

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

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
	externals: {
		moment: "moment"
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
			}
		]
	},

	plugins: production
		? [
				processHTML,
				new webpack.DefinePlugin({
					"process.env.NODE_ENV": JSON.stringify("production")
				})
		  ]
		: [processHTML]
};

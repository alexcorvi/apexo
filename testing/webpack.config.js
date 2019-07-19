module.exports = {
	entry: __dirname + "/test.ts",
	mode: "development",
	target: "electron-renderer",
	output: {
		filename: "test.js",
		path: __dirname
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	}
};

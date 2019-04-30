module.exports = {
	entry: './src/index',
	output: {
		path: `${__dirname}/public`,
		filename: 'bundle.js'
	},
	module: {
		rules: [
		    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
		]
	},
	devtool: 'source-map'
}
require("@babel/polyfill");

module.exports = (env, argv)=> ({
	entry: ['@babel/polyfill','./src/index'],
	output: {
		path: `${__dirname}/public`,
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
			{ test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] }
		]
	},
	devtool: argv.mode=== 'development' ? 'inline-source-map' : false
})
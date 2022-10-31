const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = () => {
	return {
		// configurations for webpack
		mode: 'development',
		entry: {
			main: './src/js/index.js',
			install: './src/js/install.js'
		},
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, 'dist'),
		},
		plugins: [
			// Webpack plugin to generate html file and bundles
			new HtmlWebpackPlugin({
				template: './index.html',
				title: 'Just Another Text Editor'
			}),

			// service worker
			new InjectManifest({
				swSrc: './src-sw.js',
				swDest: 'src-sw.js',
			}),

			// webpack plugin to allow installation of PWA
			new WebpackPwaManifest({
				fingerprints: false,
				inject: true,
				name: 'Just Another Text Editor',
				short_name: 'J.A.T.E.',
				description: 'Takes notes with JavaScript syntax highlighting!',
				background_color: '#225ca3',
				theme_color: '#225ca3',
				start_url: '/',
				publicPath: '/',
				icons: [
					{
						src: path.resolve('src/images/logo.png'),
						sizes: [96, 128, 192, 256, 384, 512],
						destination: path.join('assets', 'icons'),
					},
				],
			}),

		],

		module: {
			rules: [
				// handle css files
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},
				// handle js files
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					
					// use babel to ensure any latest versions of javascript will run
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
						},
					},
				},
			],
		},
	};
};

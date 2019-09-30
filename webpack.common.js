/* global __dirname, require, module*/

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    'datashoplogger': path.resolve(__dirname, 'src/index.js')
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'lib')//,
    // Make sure you use amd modules since we're trying to be compatible with the system that will load us
    /*
    libraryTarget: 'amd',
    umdNamedDefine: true
    */
  },
  module: {
    rules: [
      {
        test:/\.(s*)css$/,
        use: ExtractTextPlugin.extract({ 
          fallback: 'style-loader',
          use: ['css-loader','sass-loader']
        })
      },{
        test: /\.(png|jp(e*)g|svg)$/,  
        use: [{
          loader: 'url-loader',
          options: { 
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[hash]-[name].[ext]'
          } 
        }]
      },
      /* {
         enforce: "pre",
         test: /\.js$/,
         exclude: /node_modules/,
         loader: "eslint-loader"
	    }, */
      {
        test: /(\.js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          // babel-loader to convert ES6 code to ES5 + amdCleaning
          // requirejs code into simple JS code,
          // taking care of modules to load as desired
          loader: 'babel-loader',
          options: {
            presets: ["babel-preset-es2015"],
            plugins: []
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'application': 'main',
      'base64': 'vendor/base64'
    },
    modules: [
      path.resolve('./node_modules'),
      path.resolve('./src')
    ],
    extensions: ['.json', '.js']
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
};

module: {
  rules: [
    {test: /\.png$/, use: 'url-loader?mimetype=image/png'},
  ]
}
var HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path');
const process = require('process');
var webpack = require('webpack');

var node_env = process.env.NODE_ENV || 'development';

var plugins = [
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    title: 'Bahnhofs Abfahrten',
    minify: {}
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(node_env)
    }
  })
];

if (node_env === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
}

var alias = {
  eventemitter: 'eventemitter3'
};
var config = path.resolve('src/config.' + node_env + '.js');
alias.config = config;

module.exports = {
  devtool: node_env === 'production' ? undefined : 'cheap-module-source-map',
  eslint: {
    configFile: './src/.eslintrc',
    failOnWarning: true,
    failOnError: true
  },
  context: __dirname,
  resolve: {
    alias,
    root: path.resolve('src')
  },
  entry: [
    './src/main.js'
  ],
  output: {
    path: path.resolve('public'),
    filename: 'app-[hash].js',
    publicPath: ''
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.CSS.js$/, exclude: /(node_modules|dependency)/, loader: 'inline-css!babel' },
      { test: /\.less$/, loader: 'style!css!autoprefixer?browsers=last 2 version!less' },
      { test: /^((?!CSS\.js$).)*(\.jsx?)$/,
        exclude: /(node_modules)/,
        loader: 'babel!eslint',
      },
      { test: /\.(jpg|png|gif)$/, loader: 'file!image' },
      { test: /\.(eot|ttf|svg|otf|woff)(.*)?$/, loader: 'url' },
      { test: /\.json$/, loader: 'json' }
    ]
  },
  plugins,
};

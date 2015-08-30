var path = require('path');
var webpack = require('webpack');

module.exports = {
  eslint: {
    configFile: 'src/.eslintrc',
    failOnWarning: true,
    failOnError: true
  },
  context: __dirname,
  entry: [
    './src/main.js'
  ],
  output: {
    path: path.resolve('www'),
    filename: 'app.js',
    publicPath: ''
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'react-hot!babel!eslint', include: path.join(__dirname, 'src')},
      { test: /\.(jpg|png|gif)$/, loader: 'file!image' },
      { test: /\.woff2?(\?v=.*)?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
      { test: /\.(eot|ttf|svg|otf)(\?v=.*)?$/, loader: 'url' },
      { test: /\.json$/, loader: 'json' }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};

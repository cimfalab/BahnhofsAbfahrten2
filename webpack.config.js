var path = require('path');

module.exports = {
  eslint: {
    configFile: './.eslintrc',
    failOnWarning: true,
    failOnError: true
  },
  context: __dirname,
  entry: ['./src/main.js'],
  output: {
    path: path.resolve('www'),
    filename: 'app.js',
    publicPath: ''
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: 'style!css!autoprefixer?browsers=last 2 version!less?root=.'},
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime!eslint'},
      { test: /\.(jpg|png|gif)$/, loader: 'file!image' },
      { test: /\.woff2?(\?v=.*)?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
      { test: /\.(eot|ttf|svg|otf)(\?v=.*)?$/, loader: 'file' },
      { test: /\.json$/, loader: 'json' }
    ]
  }
};

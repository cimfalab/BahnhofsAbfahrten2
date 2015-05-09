module.exports = {
  eslint: {
    configFile: './.eslintrc',
    failOnWarning: true,
    failOnError: true
  },
  context: __dirname,
  entry: ['./src/main.js'],
  output: {
    path: __dirname + '/www',
    filename: 'app.js',
    publicPath: ''
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: 'style/url!css!autoprefixer?browsers=last 2 version!less?root=.'},
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime!eslint'},
      { test: /\.(jpg|png|gif)$/, loader: 'file!image' }
    ]
  }
};

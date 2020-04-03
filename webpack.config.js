const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public')
  },
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
    compress: false,
    port: 4200
  },
}

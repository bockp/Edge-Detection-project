const path = require('path');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  target: 'web',
  output: {
    filename: 'TIMES.bundle.js',
    path: path.resolve(__dirname, 'javascripts'),
    library: 'T'
  },
  plugins: [
/*    new UglifyJSPlugin({
      uglifyOptions: {
        ecma: 8
      }
    })
*/
  ]
};


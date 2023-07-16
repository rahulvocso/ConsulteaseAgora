const path = require('path');
const {DefinePlugin} = require('webpack'); //FOR: VM2005:2 Uncaught ReferenceError: process is not defined
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ...other webpack configuration options...
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'), // Set your desired root folder here
      'node_modules',
    ],
  },
};


module.exports = {
  context: path.resolve(__dirname, 'react-frontend'),
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'), // Set your desired root folder here added by rahul to mitigate a ts error for metro-config
      'node_modules',
    ],
    extensions: ['.ts', '.js', '.html', '.jsx', '.tsx'],
    alias: {
      process: "process/browser"
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        use: ['ts-loader'],
        //exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {test: /\.css$/, loader: 'style-loader!css-loader'},
    ],
    loaders: [{test: /\.css$/, loader: 'style-loader!css-loader'}],
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/StartCameraHTML.html',
        filename: 'index.html',
      }),
      new DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
    ],
  },
};

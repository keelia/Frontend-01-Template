const path = require('path');

module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [["@babel/plugin-transform-react-jsx",{pragma:"create"}]]
          }
        }
      },
      {
        test: /\.css$/,
        use: {
          loader: path.resolve('./tool/component-css-loadder.js'),//自定义css loader
        }
      }
    ]
  },
  plugins: [
    new (require('html-webpack-plugin'))
  ],
  mode: 'development',
  devtool: 'inline-source-map',
  optimization:{
    minimize: false
  },
  devServer:{
    open:true,
    compress:false,
    contentBase:"./src"
  }
};
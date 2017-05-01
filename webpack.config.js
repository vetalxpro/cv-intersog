const webpack = require('webpack');
const path = require('path');
const {CheckerPlugin} = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCSS = new ExtractTextPlugin({
  filename: "assets/css/[name].css",
  disable: process.env.NODE_ENV === "development"
});


const config = {
  context: path.join(__dirname, './client/src/ts'),
  entry: {
    main: ['./main.ts']
  },
  output: {
    path: path.join(__dirname, './public'),
    filename: 'assets/js/[name].bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new CheckerPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './client/src/html/pug/index.pug')
    }),
    extractCSS
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, './client/src'),
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.css$/,
        include: [
          path.join(__dirname, './client/src/styles'),
          path.join(__dirname, './bower_components')
        ],
        use: extractCSS.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')({
                    browsers: ['last 2 versions', 'ie 9']
                  })
                ]
              },
              sourceMap: false
            }
          }],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(scss|sass)$/,
        include: path.join(__dirname, './client/src'),
        use: extractCSS.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')({
                    browsers: ['last 2 versions', 'ie 9']
                  })
                ]
              },
              sourceMap: false
            }
          }, {
            loader: 'resolve-url-loader',
            options: {
              keepQuery: true
            }
          },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }],
          fallback: 'style-loader'
        })

      },
      {
        test: /\.(jpe?g|png|svg)$/,
        exclude: /fontawesome/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '/',
              outputPath: 'assets/img/'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '/',
              outputPath: 'assets/fonts/'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        include: /fontawesome/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '/',
              outputPath: 'assets/fonts/'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, './public'),
    compress: false,
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
    watchContentBase: true
  }
};

module.exports = config;
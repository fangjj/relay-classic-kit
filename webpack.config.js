const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let appEntry;
let devtool;
let plugins;

if (process.env.NODE_ENV === 'production') {
  appEntry = [path.join(__dirname, 'src/index.js')];
  devtool = 'source-map';
  plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        drop_console: true,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      favicon: path.join(__dirname, 'src/stylesheets/favicon.ico'),
      production: true,
      minify: {
        removeComments:true,
        collapseWhitespace:false,
      }
    }),
  ];
} else {
  appEntry = [
    path.join(__dirname, 'src/index.js')
  ];
  devtool = 'cheap-module-source-map';
  plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      favicon: path.join(__dirname, 'src/stylesheets/favicon.ico'),
      production: false,
      minify: {
        removeComments:true,
        collapseWhitespace:false,
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ];
}

module.exports = {
  entry: {
    app: appEntry,
    vendor: ['react', 'react-dom', 'react-relay', 'react-router', 'react-router-relay']
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'public'),
    publicPath: '/'
  },
  devtool,
  module: {
    rules: [{
      enforce: "pre",
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "eslint-loader",
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: (loader) => [
              require('autoprefixer')({ browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'] })
            ]
          }
        }
      ]
    }, {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: (loader) => [
              require('autoprefixer')({ browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'] })
            ]
          }
        },
        'less-loader'
      ]
    }, {
      test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'images/[name]_[hash].[ext]'
          }
        }
      ]
    }, {
      test: /learn.json/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]'
      }
    }]
  },
  resolve: {
    alias: {
      Jm: path.resolve(__dirname, 'src'),
      //AluClinic: path.resolve(__dirname)
    }
  },
  plugins,
  devServer: {
    contentBase: path.join(__dirname, "public"),
    publicPath: '/',
    stats: { colors: true },
    historyApiFallback: true,
    port: 9000,
    watchContentBase: true
  }
};
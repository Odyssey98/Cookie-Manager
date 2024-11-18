const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtReloader = require('webpack-ext-reloader');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: './src/index.tsx',
    background: './src/background/background.ts',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: (pathData) => {
      return pathData.chunk.name === 'background' 
        ? 'background.js' 
        : 'static/js/[name].js';
    },
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ]
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['main'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
      },
    },
  },
  devServer: {
    port: 3000,
    hot: true,
    open: false,
  },
}; 
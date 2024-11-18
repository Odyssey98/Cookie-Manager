const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
                ['@babel/preset-react', {
                  runtime: 'automatic'
                }],
                '@babel/preset-typescript'
              ]
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name][ext]'
        }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react': path.resolve(__dirname, 'node_modules/react')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['main'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ],
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false
      }
    }
  },
  devServer: {
    port: 3000,
    hot: true,
    open: false,
    static: {
      directory: path.join(__dirname, 'public')
    }
  }
}; 
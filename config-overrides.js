const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ExtReloader = require('webpack-ext-reloader');

module.exports = function override(config, env) {
  // 开发环境添加热重载插件
  if (env === 'development') {
    config.plugins.push(
      new ExtReloader({
        port: 9090,
        reloadPage: true,
        entries: {
          contentScript: ['content'],
          background: 'background',
          extensionPage: ['popup']
        }
      })
    );
  }

  // 添加 background 脚本入口
  config.entry = {
    main: path.join(__dirname, 'src/index.tsx'),
    background: path.join(__dirname, 'src/background/background.ts')
  };

  // 修改输出配置，确保 background.js 直接输出到根目录
  config.output = {
    ...config.output,
    filename: (pathData) => {
      return pathData.chunk.name === 'background' 
        ? 'background.js' 
        : 'static/js/[name].js';
    },
    chunkFilename: 'static/js/[name].chunk.js'
  };

  // 禁用代码分割
  config.optimization = {
    ...config.optimization,
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false
      }
    }
  };

  // 复制静态文件
  config.plugins.push(
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
  );

  // 确保 background.js 不会被压缩或分割
  config.module.rules.push({
    test: /background\.ts$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-typescript']
        }
      }
    ],
    exclude: /node_modules/
  });

  return config;
};
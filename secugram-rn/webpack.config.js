const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);

module.exports = {
  entry: path.resolve(appDirectory, 'index.js'),
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [
          path.resolve(appDirectory, 'index.js'),
          path.resolve(appDirectory, 'App.js'),
          path.resolve(appDirectory, 'src'),
          path.resolve(appDirectory, 'node_modules', 'react-native'),
          path.resolve(appDirectory, 'node_modules', 'react-native-web'),
          path.resolve(appDirectory, 'node_modules', '@react-native'),
          path.resolve(appDirectory, 'node_modules', '@react-navigation'),
          path.resolve(appDirectory, 'node_modules', 'react-native-screens'),
          path.resolve(appDirectory, 'node_modules', 'react-native-safe-area-context'),
          path.resolve(appDirectory, 'node_modules', 'react-native-image-picker'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { loose: true }],
              '@babel/preset-react',
            ],
            plugins: [
              'react-native-web',
              ['@babel/plugin-transform-class-properties', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              ['@babel/plugin-transform-private-property-in-object', { loose: true }],
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(appDirectory, 'public/index.html'),
    }),
  ],
  devServer: {
    port: 8080,
    hot: true,
    historyApiFallback: true,
  },
  mode: 'development',
};

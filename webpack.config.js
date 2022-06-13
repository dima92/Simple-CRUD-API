const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/server.ts',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    open: true,
    host: 'localhost'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset'
      },
      {
        test: /\.json$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';

  } else {
    config.mode = 'development';
  }
  return config;
};

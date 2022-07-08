const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'web',
  entry: {
    app: ['./src/entry.js']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    environment: {
      arrowFunction: false
    }
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      'webcrypto-fallback': path.resolve(__dirname, '../library/dist/')
    },
    fallback: {
      crypto: false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  'targets': {
                    'chrome': '58',
                    'ie': '9'
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public' }
      ]
    })
  ],
  optimization: {
    minimize: false
  }
}

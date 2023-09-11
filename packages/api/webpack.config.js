const path = require('path');

module.exports = {
  entry: './handler.ts',
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: false
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    symlinks: false,
    cacheWithContext: false
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  externals: [],
  node: {
    __dirname: false
  }
};

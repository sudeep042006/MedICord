const webpackOverride = require('./webpack.config.js');

module.exports = {
  webpack: {
    configure: webpackOverride,
  },
}; 
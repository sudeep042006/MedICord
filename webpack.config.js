const path = require('path');

module.exports = function override(config, env) {
  // Disable source map warnings
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /ENOENT: no such file or directory/,
    /webpack:\/\/\/.*\.ts/,
  ];
  
  // Exclude node_modules from source map loader
  config.module.rules.forEach(rule => {
    if (rule.enforce === 'pre' && rule.use && rule.use.some(use => use.loader && use.loader.includes('source-map-loader'))) {
      rule.exclude = /node_modules/;
    }
  });
  
  return config;
}; 
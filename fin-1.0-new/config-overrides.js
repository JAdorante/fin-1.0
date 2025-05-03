const { override, disableEsLint } = require('customize-cra');

module.exports = override(
  // Disable ESLint in webpack
  disableEsLint(),
  
  // Add Node.js polyfill fallbacks
  (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "fs": false,
      "path": false,
      "os": false
    };
    return config;
  }
);
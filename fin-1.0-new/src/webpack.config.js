module.exports = function override(config, env) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "fs": false, // fs doesn't have a good browser polyfill
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser")
    };
    
    return config;
  };
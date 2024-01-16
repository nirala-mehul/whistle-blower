const { addWebpackResolve } = require('customize-cra');

module.exports = addWebpackResolve({
  fallback: {
    crypto: require.resolve('crypto-browserify'),
    assert: require.resolve('assert/'),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer/"),
    zlib: require.resolve('browserify-zlib')
  },
});

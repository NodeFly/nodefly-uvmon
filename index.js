// Precompile the profiler module for 4 platforms: Windows, Solaris/SunOS,
// Linux, OSX on both 32 and 64 bit architectures where relevant

var version = require('./version')(process);

// TODO(rmg): should be local, ideal bundled, fallback bundled, then fallback

try {
  // try local build dir in case node-gyp was successful
  module.exports = require(version.localBuild);

} catch (err) {
  try {
    module.exports = require(version.bundledBuild);

  } catch (err) {
    // stub out the API functions in case we were unable to load the native
    // module, which will prevent it from blowing up
    module.exports = { getData: function stubbedGetData() {} };
    console.log('Unable to load native module for ' + version.name + '; ' +
                'some features may be unavailable without compiling it.');
  }
}

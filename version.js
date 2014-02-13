var path = require('path');
var name = 'uvmon';

// Need to always build under the same verisons, or remove the old directories
// and update to new ones when we use a different version on the same minor
// release number.

var version_map = {
  'v0.10.*': 'v0.10.12'
};

function version(proc) {
  proc = proc || process;

  var platform = proc.platform;
  var key;
  var lib_ver = 'NOT_BUNDLED';

  if (platform == 'solaris') platform = 'sunos';

  for (key in version_map) {
    if (RegExp(key).test(proc.version)) {
      lib_ver = version_map[key];
    }
  }

  // if libVer doesn't correspond to an existing path then require will fail.

  return {
    name: name,
    localBuild: './build/Release/' + name,
    bundledBuild: path.join('.', 'compiled', platform, proc.arch, lib_ver, name)
  }
}

module.exports = version;

var path = require('path');
var name = 'uvmon';

// Need to always build under the same verisons, or remove the old directories
// and update to new ones when we use a different version on the same minor
// release number.

var versionMap = {
  'v0.10.12': /v0\.10\..*/
};

function version(proc) {
  proc = proc || process;

  var platform = proc.platform;
  if (platform == 'solaris') platform = 'sunos';

  // intentionally defaults to a path that may not exist
  var libVer = proc.version;

  for (var bundledVersion in versionMap) {
    if (versionMap[bundledVersion].test(proc.version)) {
      libVer = bundledVersion;
      break;
    }
  }

  // if libVer doesn't correspond to an existing path then require will fail.

  return {
    name: name,
    localBuild: './build/Release/' + name,
    bundledBuild: path.join('.', 'compiled', platform, proc.arch, libVer, name)
  }
}

module.exports = version;

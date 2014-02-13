var path = require('path');
var name = 'uvmon';

// Requires that all bundled binaries be compiled for the same release
var versionMap = {
  'v0.10.12': /v0\.10\..*/
};

function version(proc) {
  proc = proc || process;

  var platform = proc.platform;
  if (platform == 'solaris') platform = 'sunos';

  var libVer = proc.version;
  for (var bundledVersion in versionMap) {
    if (versionMap[bundledVersion].test(proc.version)) {
      libVer = bundledVersion;
      break;
    }
  }

  return {
    name: name,
    // these paths are where to look, not guarantees that they exist
    localBuild: relPath('build', 'Release', name),
    bundledBuild: relPath('compiled', platform, proc.arch, libVer, name)
  }
}

// ensures a leading ./ because require() needs it to do a filesystem path,
// not a module path
function relPath() {
  return '.' + path.sep + path.join.apply(null, arguments);
}

module.exports = version;

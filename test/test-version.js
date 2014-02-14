var should = require('should');
var version = require('../version');
var path = require('path');

describe('bundled binary path', function() {
  it('maps v0.10.* to v0.10.12', function() {
    var versions = ['v0.10.0', 'v0.10.12', 'v0.10.20', 'v0.10.40-pre'];
    versions.forEach(function(ver) {
      var proc = { version: ver, platform: 'test', arch: 'x64' };
      version(proc).bundledBuild.should.include('v0.10.12');
    });
  });

  it('does not explode with unknown versions', function() {
    var bad = { version: 'v0.11.11-foo', platform: 'test', arch: 'x64' };
    version(bad).bundledBuild.should.include(bad.version);
  });

  it('is a path that node will recognize as relative', function() {
    version().bundledBuild.should.startWith('.');
  });

  it('accounts for architecture', function() {
    version(process).bundledBuild.should.include(process.arch);
  });

  it('account for OS', function() {
    var proc = { version: 'v', arch: 'x86', platform: 'awesomeOS' };
    version(proc).bundledBuild.should.include('awesomeOS');
  });

  it('maps solaris to sunos', function() {
    var proc = { version: 'v', arch: 'x86', platform: 'solaris' };
    version(proc).bundledBuild.should.not.include('solaris');
    version(proc).bundledBuild.should.include('sunos');
  });
});

describe('local build binary paths', function() {
  it('has a localBuild', function() {
    var v = version();
    v.should.have.property('localBuild');
    v.localBuild.should.endWith(path.join('build', 'Release', 'uvmon'));
    v.localBuild.should.startWith('.');
  });
});

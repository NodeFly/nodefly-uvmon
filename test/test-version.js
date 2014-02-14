var should = require('should');
var version = require('../version');

describe('Binary paths', function() {
  it('maps v0.10.* to v0.10.12', function() {
    var vTens = ['v0.10.0', 'v0.10.12', 'v0.10.20', 'v0.10.40-pre'];
    vTens.forEach(function(ver,i,a) {
      var proc = { version: ver, platform: 'test', arch: 'x64' };
      version(proc).bundledBuild.should.include('v0.10.12');
    });
  });

  it('does not explode with unknown versions', function() {
    var bad = { version: 'v0.11.11-foo', platform: 'test', arch: 'x64' };
    version(bad).bundledBuild.should.include(bad.version);
  });

  it('has a localBuild', function() {
    var v = version();
    v.should.have.property('localBuild');
    v.localBuild.should.endWith('/build/Release/uvmon');
  });
});

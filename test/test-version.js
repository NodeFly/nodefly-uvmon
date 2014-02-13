var should = require('should');
var version = require('../version');

describe('Binary paths', function() {
  it('maps v0.10.* to v0.10.12', function() {
    var process_10_1 = { version: 'v0.10.1', platform: 'test', arch: 'x64' };
    var process_10_20 = { version: 'v0.10.20', platform: 'test', arch: 'x64' };
    version(process_10_1).bundledBuild.should.include('v0.10.12');
    version(process_10_20).bundledBuild.should.include('v0.10.12');
  });

  it('does not explode with unknown versions', function() {
    var bad = { version: 'v0.11.11-foo', platform: 'test', arch: 'x64' };
    version(bad).bundledBuild.should.include('NOT_BUNDLED');
  });

  it('has a localBuild', function() {
    var v = version();
    v.should.have.property('localBuild');
    v.localBuild.should.endWith('/build/Release/uvmon');
  });
});

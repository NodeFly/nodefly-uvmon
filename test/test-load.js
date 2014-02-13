var should = require('should');
var fs = require('fs');
var path = require('path');
var version = require('../version')();

describe('Module loading from various locations', function() {

  var base = process.cwd();
  var buildPath = version.localBuild;
  var compiledPath = version.bundledBuild;
  var compiledFile = path.resolve(base, compiledPath + '.node');
  var buildFile = path.resolve(base, buildPath + '.node');
  var compiledModule = path.resolve(base, compiledPath);
  var buildModule = path.resolve(base, buildPath);
  var baseModule = path.resolve(base, 'index.js');

  function loadAndTest(path, callback) {
    var uvmon = require(path);
    uvmon.should.have.property('getData');
    uvmon.getData.should.be.type('function');
    var ret = uvmon.getData();
    ret.should.have.property('count');
    ret.should.have.property('sum_ms');
    ret.should.have.property('slowest_ms');
    // call this to properly unload the check_cb - only need it when we're
    // doing funky multiple versions of this module at once
    uvmon.stop();
    callback();
  }

  it('works from ' + buildModule, function(done) {
    loadAndTest(buildModule, done);
  });

  it('loads from index.js when built locally', function(done) {
    loadAndTest(baseModule, done);
  });

  it('gets moved to ./compiled/... subdirectory', function(done) {
    fs.rename(buildFile, compiledFile, function(err) {
      if (err) {
        throw err;
      } else {
        done();
      }
    });
  });

  it('works from ' + compiledModule, function(done) {
    loadAndTest(compiledModule, done);
  });

  it('loads from index.js when precompiled', function(done) {
    loadAndTest(baseModule, done);
  });
});

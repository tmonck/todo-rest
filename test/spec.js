// built-in modules
var fs = require('fs');
var ChildProcess = require('child_process');
var http = require('http');

// third-party modules
var _ = require('lodash-node');
var Promise = require('es6-promise-polyfill').Promise;
var expect = require('chai').expect;

// project modules
var testMeta = require('./test-metadata');
var TodosServiceProxy = require('./todos-service-proxy');

// get test name (see readme.md for more information)
var testName = fs.readFileSync('./test-name.txt').toString().trim();
if (!testName || !testName.length) throw new Error('Test name must be specified in test-name.txt');
console.log('\nTest Name: ' + testName);

// get test configuration options
var options = testMeta[testName];
if (!options) throw new Error('Unrecognized test name "' + testName + '"; was not found in test-metadata.js');

// get a new proxy instance with the specified test's configuration options
var todosServiceProxy = new TodosServiceProxy(options);

var buildPostPromise = function(todo) {
  return new Promise(function (resolve, reject) {
    todosServiceProxy.post(todo, function (err, responseInfo) {
      if (err) reject(err.message);
      resolve(responseInfo.responseObject);
    });
  });
};

// launch the server process (if applicable)
var serverProcess;
if (options.serverProcess) {
  serverProcess = ChildProcess.spawn(options.serverProcess.command, options.serverProcess.args, options.serverProcess.options);
}

// perform initial setup (if applicable)
before(function(done) {
  if (options.resetPath) {

    var reset = function (callback) {
      var request = http.request({
        host: options.host,
        port: options.port,
        path: (options.basePath || '') + options.resetPath,
        method: 'GET'
      }, function (response) {
        callback();
      });
      request.end();
    };

    reset(done);

  } else {
    done();
  }
});

describe('TodoREST API', function () {

  it('should initially return an empty array', function (done) {

    new Promise(function (resolve, reject) {
      todosServiceProxy.getAll(function (err, responseInfo) {
        if (err) { reject(err.message); throw err; }
        var results = responseInfo.responseObject;
        resolve(results);
      });
    }).then(function (value) {
        expect(value instanceof Array).to.be.true; // result should be an array
        expect(value.length).to.equal(0); // result array should be empty
        done()
      }).catch(function(err) {
        done(err);
      });

  });

  it('should allow adding new items', function (done) {

    var firstPost = buildPostPromise({ title: 'go round mums' });
    var secondPost = buildPostPromise({ title: 'get Liz back' });
    var thirdPost = buildPostPromise({ title: 'sort life out' });

    Promise.all([firstPost, secondPost, thirdPost]).then(function(values) {
      expect(_.find(values, { id: 0 })).to.not.exist; // sanity check
      expect(_.find(values, { id: 1 })).to.exist;
      expect(_.find(values, { id: 2 })).to.exist;
      expect(_.find(values, { id: 3 })).to.exist;
      expect(_.find(values, { id: 4 })).to.not.exist; // sanity check
      expect(_.find(values, { title: 'go round mums' })).to.exist;
      expect(_.find(values, { title: 'get Liz back' })).to.exist;
      expect(_.find(values, { title: 'sort life out' })).to.exist;
      done();
    }).catch(function(err) {
      done(err);
    });

  });

  it('should return recently added items', function (done) {

    new Promise(function (resolve, reject) {
      todosServiceProxy.getAll(function (err, responseInfo) {
        if (err) { reject(err.message); throw err; }
        var results = responseInfo.responseObject;
        resolve(results);
      });
    }).then(function (value) {
        expect(value.length).to.equal(3); // there should be 3 todos now
        expect(_.find(value, { title: 'abc' })).to.not.exist; // sanity check
        expect(_.find(value, { title: 'go round mums' })).to.exist;
        expect(_.find(value, { title: 'get Liz back' })).to.exist;
        expect(_.find(value, { title: 'sort life out' })).to.exist;
        done()
      }).catch(function(err) {
        done(err);
      });

  });

  it('should allow retrieving a single item by id', function (done) {

    new Promise(function (resolve, reject) {
      todosServiceProxy.getById(3, function (err, responseInfo) {
        if (err) { reject(err.message); throw err; }
        var results = responseInfo.responseObject;
        resolve(results);
      });
    }).then(function (value) {
        expect(value.id).to.equal(3); // the id should match what was asked for
        expect(value.title.length).to.be.at.least(1); // the title should be populated
        done()
      }).catch(function(err) {
        done(err);
      });

  });

  it('should allow updating a single item', function (done) {

    var id = 3;
    var newTitle = 'do something different';

    new Promise(function (resolve, reject) {
      todosServiceProxy.update(id, { id: id, title: newTitle }, function (err, responseInfo) {
        if (err) { reject(err.message); throw err; }
        var results = responseInfo.responseObject;
        resolve(results);
      });
    }).then(function (value) {

        expect(value ? true : false).to.be.false; // PUT doesn't return a response object

        // get the updated item for verification
        new Promise(function (resolve, reject) {
          todosServiceProxy.getById(id, function (err, responseInfo) {
            if (err) { reject(err.message); throw err; }
            var results = responseInfo.responseObject;
            resolve(results);
          });
        }).then(function (value) {
            expect(value.title).to.equal(newTitle); // should match updated value
            done()
          }).catch(function(err) {
            done(err);
          });

      }).catch(function(err) {
        done(err);
      });

  });

  it('should allow deleting an item', function (done) {

    new Promise(function(resolve, reject) {
      todosServiceProxy.delete(3, function (err, responseInfo) {
        if (err) { reject(err.message); throw err; }
        var results = responseInfo.responseObject;
        resolve(results);
      });
    }).then(function (value) {

        expect(value ? true : false).to.be.false; // DELETE doesn't return a response object

        // get all todos for verification
        new Promise(function (resolve, reject) {
          todosServiceProxy.getAll(function (err, responseInfo) {
            if (err) { reject(err.message); throw err; }
            var results = responseInfo.responseObject;
            resolve(results);
          });
        }).then(function (value) {
            expect(value.length).to.equal(2); // there should only be 2 items left now
            done()
          }).catch(function(err) {
            done(err);
          });

      }).catch(function(err) {
        done(err);
      });
  });

});

// kill the server process (if applicable)
after(function () {
  if (serverProcess) {
    serverProcess.kill();
  }
});
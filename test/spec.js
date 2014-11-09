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

// launch the server process (if applicable)
var serverProcess;
if (options.serverProcess) {
  serverProcess = ChildProcess.spawn(options.serverProcess.command, options.serverProcess.args, options.serverProcess.options);
}

// start by clearing any previously created todos
before(function(done) {

  new Promise(function(resolve, reject) {
    todosServiceProxy.deleteAll(function (err, responseInfo) {
      if (err) { reject(err.message); throw err; }
      resolve(responseInfo);
    });
  }).then(function (responseInfo) {
      expect(responseInfo.statusCode).to.equal(204); // DELETE returns a 204 No Content
      expect(responseInfo.responseObject ? true : false).to.be.false; // DELETE doesn't return a response object
      done();
    }).catch(function(err) {
      done(err);
    });
});

describe('TodoREST API', function () {

  it('should initially return an empty array', function (done) {

    new Promise(function (resolve, reject) {
      todosServiceProxy.getAll(function (err, responseInfo) {
        if (err) { reject(err.message); throw err; }
        resolve(responseInfo);
      });
    }).then(function (responseInfo) {
        expect(responseInfo.statusCode).to.equal(200);
        expect(responseInfo.responseObject instanceof Array).to.be.true; // result should be an array
        expect(responseInfo.responseObject.length).to.equal(0); // result array should be empty
        done()
      }).catch(function(err) {
        done(err);
      });

  });

  it('should allow adding new items', function (done) {

    var buildPostPromise = function(todo) {
      return new Promise(function (resolve, reject) {
        todosServiceProxy.post(todo, function (err, responseInfo) {
          if (err) { reject(err.message); throw err; }
          resolve(responseInfo);
        });
      });
    };

    var firstPost = buildPostPromise({ title: 'go round mums' });
    var secondPost = buildPostPromise({ title: 'get Liz back' });
    var thirdPost = buildPostPromise({ title: 'sort life out' });

    Promise.all([firstPost, secondPost, thirdPost]).then(function(values) {
      expect(values[0].statusCode).to.equal(201);
      expect(values[1].statusCode).to.equal(201);
      expect(values[2].statusCode).to.equal(201);
      expect(_.find(values, function (responseInfo) { return responseInfo.responseObject.id === 0; })).to.not.exist; // sanity check
      expect(_.find(values, function (responseInfo) { return responseInfo.responseObject.id === 1; })).to.exist;
      expect(_.find(values, function (responseInfo) { return responseInfo.responseObject.id === 2; })).to.exist;
      expect(_.find(values, function (responseInfo) { return responseInfo.responseObject.id === 3; })).to.exist;
      expect(_.find(values, function (responseInfo) { return responseInfo.responseObject.id === 4; })).to.not.exist; // sanity check
      expect(_.find(values, function (responseInfo) { return responseInfo.responseObject.title === 'go round mums'; })).to.exist;
      expect(_.find(values, function (responseInfo) { return responseInfo.responseObject.title === 'get Liz back'; })).to.exist;
      expect(_.find(values, function (responseInfo) { return responseInfo.responseObject.title === 'sort life out'; })).to.exist;
      done();
    }).catch(function(err) {
      done(err);
    });

  });

  it('should return recently added items', function (done) {

    new Promise(function (resolve, reject) {
      todosServiceProxy.getAll(function (err, responseInfo) {
        if (err) { reject(err.message); throw err; }
        resolve(responseInfo);
      });
    }).then(function (responseInfo) {
        expect(responseInfo.statusCode).to.equal(200);
        expect(responseInfo.responseObject.length).to.equal(3); // there should be 3 todos now
        expect(_.find(responseInfo.responseObject, { title: 'abc' })).to.not.exist; // sanity check
        expect(_.find(responseInfo.responseObject, { title: 'go round mums' })).to.exist;
        expect(_.find(responseInfo.responseObject, { title: 'get Liz back' })).to.exist;
        expect(_.find(responseInfo.responseObject, { title: 'sort life out' })).to.exist;
        done()
      }).catch(function(err) {
        done(err);
      });

  });

  it('should allow retrieving a single item by id', function (done) {

    new Promise(function (resolve, reject) {
      todosServiceProxy.getById(3, function (err, responseInfo) {
        if (err) { reject(err.message); throw err; }
        resolve(responseInfo);
      });
    }).then(function (responseInfo) {
        expect(responseInfo.statusCode).to.equal(200);
        expect(responseInfo.responseObject.id).to.equal(3); // the id should match what was asked for
        expect(responseInfo.responseObject.title.length).to.be.at.least(1); // the title should be populated
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
        resolve(responseInfo);
      });
    }).then(function (responseInfo) {

        expect(responseInfo.statusCode).to.equal(204);
        expect(responseInfo.responseObject ? true : false).to.be.false; // PUT doesn't return a response object

        // get the updated item for verification
        new Promise(function (resolve, reject) {
          todosServiceProxy.getById(id, function (err, responseInfo) {
            if (err) { reject(err.message); throw err; }
            resolve(responseInfo);
          });
        }).then(function (responseInfo) {
            expect(responseInfo.statusCode).to.equal(200);
            expect(responseInfo.responseObject.title).to.equal(newTitle); // should match updated value
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
        resolve(responseInfo);
      });
    }).then(function (responseInfo) {

        expect(responseInfo.statusCode).to.equal(204);
        expect(responseInfo.responseObject ? true : false).to.be.false; // DELETE doesn't return a response object

        // get all todos for verification
        new Promise(function (resolve, reject) {
          todosServiceProxy.getAll(function (err, responseInfo) {
            if (err) { reject(err.message); throw err; }
            resolve(responseInfo);
          });
        }).then(function (responseInfo) {
            expect(responseInfo.statusCode).to.equal(200);
            expect(responseInfo.responseObject.length).to.equal(2); // there should only be 2 items left now
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
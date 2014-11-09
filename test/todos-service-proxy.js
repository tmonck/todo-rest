var http = require('http');
var HttpHelper = require('./http-helper');

/**
 * Provides helper methods for performing read/write operations against a Todos RESTful API.
 * @param options {Object} Configuration object containing the following properties:
 *   - {String} host: (required) The API host name (e.g., "localhost" or "www.myproxy.com")
 *   - {Number} port: (optional; default = 80) The API port number
 *   - {String} basePath: (optional; default = "") Base path to the API (e.g., "/api")
 * @example
 * // would result in an API path of "http://localhost:8888/api/v2/todos" for the todos resource
 * var todosServiceProxy = new TodosServiceProxy({ host: 'localhost', port: 8888, basePath: '/api/v2' });
 * @constructor
 */
var TodosServiceProxy = function(options) {

  // set default options if not explicitly set
  options.port = options.port || 80;
  options.basePath = options.basePath || "";

  /**
   * Gets all todos.
   * @param callback  Callback function taking two parameters: (1) standard error object; (2) responseInfo { data: String, responseObject: Object }
   */
  this.getAll = function (callback) {
    var request = http.request({
      host: options.host,
      port: options.port,
      path: (options.basePath || '') + '/todos',
      method: 'GET'
    }, function (response) {
      HttpHelper.parseResponse(response, callback);
    });
    request.end();
  };

  /**
   * Gets the todo with the specified id.
   * @param id        Todo id
   * @param callback  Callback function taking two parameters: (1) standard error object; (2) responseInfo { data: String, responseObject: Object }
   */
  this.getById = function (id, callback) {
    var request = http.request({
      host: options.host,
      port: options.port,
      path: (options.basePath || '') + '/todos/' + id,
      method: 'GET'
    }, function (response) {
      HttpHelper.parseResponse(response, callback);
    });
    request.end();
  };

  /**
   * Posts a new todo.
   * @param todo      Todo instance
   * @param callback  Callback function taking two parameters: (1) standard error object; (2) responseInfo { data: String, responseObject: Object }
   */
  this.post = function (todo, callback) {
    var json = JSON.stringify(todo);
    var request = http.request({
      host: options.host,
      port: options.port,
      path: (options.basePath || '') + '/todos',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': JSON.stringify(todo).length
      }
    }, function (response) {
      HttpHelper.parseResponse(response, callback);
    });
    request.write(json);
    request.end();
  };

  /**
   * Updates a todo by replacing the entire instance. (For partial updates, see PATCH.)
   * @param id        Todo id
   * @param todo      Updated todo instance
   * @param callback  Callback function taking two parameters: (1) standard error object; (2) responseInfo { data: String, responseObject: Object }
   */
  this.update = function (id, todo, callback) {
    var json = JSON.stringify(todo);
    var request = http.request({
      host: options.host,
      port: options.port,
      path: (options.basePath || '') + '/todos/' + id,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': JSON.stringify(todo).length
      }
    }, function (response) {
      HttpHelper.parseResponse(response, callback);
    });
    request.write(json);
    request.end();
  };

  /**
   * Deletes a todo.
   * @param id        Todo id
   * @param callback  Callback function taking two parameters: (1) standard error object; (2) responseInfo { data: String, responseObject: Object }
   */
  this.delete = function (id, callback) {
    var request = http.request({
      host: options.host,
      port: options.port,
      path: (options.basePath || '') + '/todos/' + id,
      method: 'DELETE'
    }, function (response) {
      HttpHelper.parseResponse(response, callback);
    });
    request.end();
  };

  /**
   * Deletes all todos.
   * @param callback  Callback function taking two parameters: (1) standard error object; (2) responseInfo { data: String, responseObject: Object }
   */
  this.deleteAll = function (callback) {
    var request = http.request({
      host: options.host,
      port: options.port,
      path: (options.basePath || '') + '/todos',
      method: 'DELETE'
    }, function (response) {
      HttpHelper.parseResponse(response, callback);
    });
    request.end();
  };

};

module.exports = TodosServiceProxy;
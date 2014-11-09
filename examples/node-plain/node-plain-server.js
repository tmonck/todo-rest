var http = require('http');
var url  = require('url');
var path = require('path');
var qs = require('querystring');

// Array.prototype.findIndex - MIT License (c) 2013 Paul Miller <http://paulmillr.com>
// For all details and docs: <https://github.com/paulmillr/Array.prototype.findIndex>
(function (globals) {
  if (Array.prototype.findIndex) return;

  var findIndex = function(predicate) {
    var list = Object(this);
    var length = Math.max(0, list.length) >>> 0; // ES.ToUint32;
    if (length === 0) return -1;
    if (typeof predicate !== 'function' || Object.prototype.toString.call(predicate) !== '[object Function]') {
      throw new TypeError('Array#findIndex: predicate must be a function');
    }
    var thisArg = arguments.length > 1 ? arguments[1] : undefined;
    for (var i = 0; i < length; i++) {
      if (predicate.call(thisArg, list[i], i, list)) return i;
    }
    return -1;
  };

  if (Object.defineProperty) {
    try {
      Object.defineProperty(Array.prototype, 'findIndex', {
        value: findIndex, configurable: true, writable: true
      });
    } catch(e) {
    }
  }

  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = findIndex;
  }

}(this));

var port = process.argv[2] || 8880;
var nextTodoId = 1;

var parseRequest = function(request, callback) {

  try {
    var method = request.method.toUpperCase();
    var uri = url.parse(request.url);
    var segments = uri.pathname.split('/');
    var resource = segments.length < 2 ? null : segments[1].toLowerCase();
    var id = segments.length < 3 ? null : parseInt(segments[2]);

    var requestInfo = {
      method: request.method,
      url: request.url,
      host: uri.host,
      path: uri.pathname,
      resource: resource,
      id: id
    };

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      var body = '';
      request.on('data', function (data) {
        body += data;
        // safety check
        if (body.length > 1e6) {
          request.connection.destroy();
        }
      });
      request.on('end', function () {
        //requestInfo.content = qs.parse(body);
        requestInfo.content = JSON.parse(body);
        callback(null, requestInfo);
      });
    } else {
      callback(null, requestInfo);
    }
  }
  catch (err) {
    callback(err);
  }

};

var returnOkay = function (response, data) {
  try {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    if (data !== undefined) {
      if (data instanceof String) {
        response.write(JSON.stringify(data));
      } else if (data instanceof Number) {
        response.write(JSON.stringify(data));
      } else {
        response.write(JSON.stringify(data));
      }
    }
    response.end();
  }
  catch (err) {
    write('ERROR in returnOkay(): ' + err);
  }
};

var returnNotFound = function (response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write(JSON.stringify({ message: 'Not Found' }));
  response.end();
};

http.createServer(function (request, response) {

  if (request.url === '/favicon.ico') return;

  try {
    parseRequest(request, function (err, requestInfo) {

      if (err) throw err;

      var pattern = requestInfo.method + ' ' + requestInfo.resource + (requestInfo.id === null ? '' : '/id');

      switch (pattern) {
        case 'GET todos': TodoEngine.getAllTodos(requestInfo, response); break;
        case 'GET todos/id': TodoEngine.getSingleTodo(requestInfo, response); break;
        case 'POST todos': TodoEngine.createTodo(requestInfo, response); break;
        case 'PUT todos/id': TodoEngine.overwriteTodo(requestInfo, response); break;
        case 'PATCH todos/id': TodoEngine.patchTodo(requestInfo, response); break;
        case 'DELETE todos/id': TodoEngine.deleteTodo(requestInfo, response); break;
        default: returnNotFound(response);
      }
    });
  }
  catch (err) {
    response.writeHead(500, {'Content-Type': 'text/plain'});
    response.write(err + '\n');
    response.end();
  }

}).listen(parseInt(port, 10));

var todos = [];
TodoEngine = {

  getAllTodos: function (requestInfo, response) {
    response.writeHead(200);
    response.write(JSON.stringify(todos));
    response.end();
  },

  getSingleTodo: function (requestInfo, response) {
    var index = todos.findIndex(function (item) { return item.id === requestInfo.id });
    if (index !== -1) {
      returnOkay(response, todos[index]);
    } else {
      returnNotFound(response);
    }
  },

  createTodo: function (requestInfo, response) {
    var todo = requestInfo.content;
    todo.id = nextTodoId;
    todos.push(todo);
    nextTodoId++;
    returnOkay(response, todo);
  },

  overwriteTodo: function (requestInfo, response) {
    var index = todos.findIndex(function (item) { return item.id === requestInfo.id });
    var todo = todos[index];
    if (todo) {
      todos.splice(index, 1, requestInfo.content);
      returnOkay(response, null);
    } else {
      returnNotFound(response);
    }
  },

  patchTodo: function (requestInfo, response) {
    var index = todos.findIndex(function (item) { return item.id === requestInfo.id });
    var todo = todos[index];
    if (todo) {
      for(prop in requestInfo.content.changes) {
        todo[prop] = requestInfo.content.changes[prop];
      }
    } else {
      returnNotFound(response);
    }
  },

  deleteTodo: function (requestInfo, response) {
    var index = todos.findIndex(function (item) { return item.id === requestInfo.id });
    if (index !== -1) {
      todos.splice(index, 1);
      returnOkay(response, null);
    } else {
      returnNotFound(response);
    }
  }

};
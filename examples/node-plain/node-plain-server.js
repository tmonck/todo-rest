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
      log('ERROR: ' + e);
    }
  }

  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = findIndex;
  }

}(this));

var port = process.argv[2] || 8880;
var fs = require('fs');
var nextTodoId = 1;

// logging setup
if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');
var logFileName = './logs/log ' + new Date().getTime() + '.txt';

var logProperties = function(obj, properties) {
  properties.split(',').forEach(function (name, index) {
    name = name.trim();
    if (name.substr(name.length - 1, 1) === '*') {
      name = name.substr(0, name.length - 1);
      log(name + ': ' + JSON.stringify(obj[name], null, 2));
    } else {
      log(name + ': ' + obj[name]);
    }
  });
};

var log = function (message) {
  fs.appendFile(logFileName, '[' + new Date().getTime() + '] ' + message + '\n');
};

var parseRequest = function(request, callback) {

  try {
    log('url: ' + request.url);
    var method = request.method.toUpperCase();
    var uri = url.parse(request.url);
    var segments = uri.pathname.split('/');
    log('segments: ' + segments);
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
    log('data: ' + data);
    if (data !== undefined) {
      if (data instanceof String) {
        log('data is a String');
        response.write(JSON.stringify(data));
      } else if (data instanceof Number) {
        log('data is a Number');
        response.write(JSON.stringify(data));
      } else {
        log('data is something else');
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

  log('\nNow: ' + new Date());
  log(request.method + ' ' + request.url);

  try {
    parseRequest(request, function (err, requestInfo) {

      if (err) throw err;

      log(JSON.stringify(requestInfo));

      var pattern = requestInfo.method + ' ' + requestInfo.resource + (requestInfo.id === null ? '' : '/id');
      log(pattern);

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
    // TODO: Log the error.
    log(err);
    log(JSON.stringify(err));
    response.writeHead(500, {'Content-Type': 'text/plain'});
    response.write(err + '\n');
    response.end();
  }

}).listen(parseInt(port, 10));

log('Static file server running at\n  => http://localhost:' + port + '/\nCTRL + C to shutdown');

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
    returnOkay(response, { newId: todo.id });
  },

  overwriteTodo: function (requestInfo, response) {
    log('requestInfo: ' + JSON.stringify(requestInfo));
    var index = todos.findIndex(function (item) { return item.id === requestInfo.id });
    log('index: ' + index);
    var todo = todos[index];
    log('todo: ' + JSON.stringify(todo));
    if (todo) {
      //todo = requestInfo.content;
      log('todos before: ' + JSON.stringify(todos));
      todos.splice(index, 1, requestInfo.content);
      log('todos after: ' + JSON.stringify(todos));
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
        log('patching property: ' + prop);
        todo[prop] = requestInfo.content.changes[prop];
      }
    } else {
      returnNotFound(response);
    }
  },

  deleteTodo: function (requestInfo, response) {
    log('deleteTodo()');
    log('requestInfo: ' + JSON.stringify(requestInfo));
    var index = todos.findIndex(function (item) { return item.id === requestInfo.id });
    if (index !== -1) {
      log('deleting index ' + index);
      log('todos before: ' + JSON.stringify(todos));
      todos.splice(index, 1);
      log('todos after: ' + JSON.stringify(todos));
      returnOkay(response, null);
    } else {
      returnNotFound(response);
    }
  }

};

/*

logProperties(request, 'httpVersion, headers*, method, url, statuscode');

var uri = url.parse(request.url);
logProperties(uri, 'href, protocol, host, hostname, port, pathname, search, path, query, hash');

var uriPath = url.parse(request.url).pathname;
var filename = path.join(process.cwd(), uriPath);

log('uriPath: ' + uriPath);
log('filename: ' + filename);

*/
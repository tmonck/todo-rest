/*

Contains metadata for each REST API implementation to test.

Properties:

  serverProcess: An object containing properties for a server process that needs to be spawned for this API.
                 This object's properties correlate to the parameters for the Node.js child_process.spawn() method
                 (http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).
  host:          (string, required) API host name
  port:          (number, optional, default = 80) API port number
  basePath:      (string, optional, default = "") Base path to the API (e.g., "/api")

*/
var testMetadata = {
  'node-plain': {
    serverProcess: {
      command: 'node',
      args: ['node-plain-server.js'],
      options: { cwd: '../examples/node-plain' }
    },
    host: 'localhost',
    port: 8880
  },
  'node-express': {
    serverProcess: {
      command: 'node',
      args: ['node-express-server.js'],
      options: { cwd: '../examples/node-express' }
    },
    host: 'localhost',
    port: 8881
  },
  'node-sails': {
    serverProcess: {
      command: 'node',
      args: ['node-sails-server.js'],
      options: { cwd: '../examples/node-sails' }
    },
    host: 'localhost',
    port: 8882
  },
  'asp-net-web-api-csharp': {
    host: 'localhost',
    basePath: '/TodoREST.AspNetWebApiCSharp/api'
  },
  'asp-net-web-api-vb': {
    host: 'localhost',
    basePath: '/TodoREST.AspNetWebApiCSharp/api'
  }
};

module.exports = testMetadata;
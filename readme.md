# TodoREST

Provides a working example of a REST API in a variety of different frameworks & languages.

Also provides a [Mocha](http://mochajs.org/) test script to verify that any given REST API is working correctly.

Inspired by Addy Osmani's [TodoMVC](https://github.com/tastejs/todomvc) project.

## Setup

Should work on Windows, Linux, and Mac OS X.

1. Download and install [Node.js](http://nodejs.org/download/) if you have not already done so.
1. Download the source code using either of the options below

### Download via git

1. Download and install [git](http://git-scm.com/downloads) if you have not already done so.
1. Open a console window in the directory where you want to place the *todo-rest* project directory.
1. Execute the following command line: `git clone https://github.com/troygizzi/todo-rest.git`

### Download manually

1. Use the **Download ZIP** buttons to the right.
1. Extract the ZIP file contents into the directory of your choice.

## Executing the test for one of the APIs

1. Edit the *test-name.txt* file to contain a single test name (corresponding to a `testMetadata` property in *test-metadata.js*).
1. Open a console window in the *test* subdirectory.
1. Execute the following command line: `mocha spec.js -b -s 200 -t 5000`

## Adding new tests

1. Come up with a hyphenated name that represents the framework and/or language for which you are creating a new REST API.
   (Use the existing directory names as a guideline.)
1. Create a new root-level subdirectory with that same name.
1. Put all your API code in that directory.
1. Make sure that your API meets the **API Requirements** below.
1. Add a new property (with the same hyphenated name as your new directory) to the `testMetadata` object in *test-metadata.js*,
   containing the configuration options for the new API.
1. Execute the test (see the **Execution** directions above) and ensure that all tests pass.
1. If manual setup steps are required in order for your new API to be fully functional,
   include them in a readme.md file in your API subdirectory.
   (Use the existing readme.md files in other API subdirectories as a guideline).

## API Requirements

### For the sake of simplicity:

The functionality below is considered out of scope for this particular exercise,
and should be left out in order to reduce clutter.

 - Todos should be stored in memory only (no database interaction)
 - Error handling or other logging should be omitted or kept to a bare minimum
 - Data validation should be omitted or kept to a bare minimum
 - No authorization should be required

### For the sake of consistency:

Adhering to the following requirements helps ensure that
(a) your API can be easily compared to other APIs, and
(b) the Mocha automated test script will work for your API with minimal configuration needed.

 - The API resource name must be `todos` (e.g., `http://localhost:8888/todos`)
 - The API should use JSON with camelCased property names (see **Todo Properties** below)
 - The API must support the operations listed below under **Operations**

### Todo Properties

Todo instances should only consist the following two properties.
(Note that the `id` property gets set at the server, so a new todo instance about to get POSTed to the server will only have a `title`.)

 - **id:** (required) An integer starting at 1 and auto-incrementing by 1
 - **title** (required) The text of the todo item

### Operations

 - **GET /todos** should return a *200 OK* response containing an array of todo instances (e.g, `[]` when empty, or `[{"id":1,"title":"find Waldo"}]` with one item)

 - **GET /todos/{id}** should return a *200 OK* response containing the todo with the corresponding `id` (e.g., `GET /todos/1` would return `{"id":1,"title":"find Waldo"}`

 - **POST /todos** should accept a body containing JSON for one new todo, without an `id` set (e.g., `{"title":"find Waldo"}`), set the todo's `id` property with
   the next sequential id, and return an *201 Created* response with the todo instance, including the new id (e.g., `{"id":1,"title":"find Waldo"}`)

 - **PUT /todos/{id}** should accept a body containing JSON for one updated todo (the `id` in the JSON should match the `id` in the URL), replace the corresponding todo
   in the todos array on the server, and return an empty *204 No Content* response

 - **DELETE /todos/{id}** should remove the specified todo from the todos array on the server, and return an empty *204 No Content* response

 - **DELETE /todos** should remove all todos from the todos array on the server, and return an empty *204 No Content* response
   (NOTE: This "delete everything" operation would not typically be recommended for a "normal" REST API, but is included here for ease of testing)

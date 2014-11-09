# TodoREST

Provides a working example of a REST API in a variety of different frameworks & languages.

Also provides a [Mocha](http://mochajs.org/) test script to verify that any given REST API is working correctly.

Inspired by Addy Osmani's [TodoMVC](https://github.com/tastejs/todomvc) project.

## Setup

Confirmed to work on Windows and Linux; should presumably work on Mac OS X as well.

1. Download and install [Node.js](http://nodejs.org/download/) if you have not already done so.
1. Download the source code using either of the options below

### Download via git

1. Download and install [git](http://git-scm.com/downloads) if you have not already done so.
1. Open a console window in the directory where you want to place the *todo-rest* project directory.
1. Execute the following command line: `git clone https://github.com/troygizzi/todo-rest.git`

### Download manually

1. Use the **Download ZIP** button to the right.
1. Extract the ZIP file contents into the directory of your choice.

## Executing the test for one of the APIs

### One-time initial setup
1. Open a console window in the *test* subdirectory
1. Install mocha globally (`sudo npm install -g mocha` on Linux; `npm install -g mocha` on Windows or Mac OS X)
1. Install the local dependencies listed in *package.json* by executing `npm install`

> If npm complains that it couldn't parse *package.json*, but its contents validate correctly at [jsonlint.com](http://jsonlint.com/),
> try deleting *package.json* and then installing each dependency manually as follows:
>
>     npm install lodash-node
>     npm install es6-promise-polyfill
>     npm install chai

### Every time
1. Edit the *test-name.txt* file to contain a single test/API name (e.g., `node-plain`)
   (this corresponds to an *examples* subdirectory and also a `testMetadata` object property in *test-metadata.js*).
1. Open a console window in the *test* subdirectory.
1. Execute the following command line: `mocha spec.js -b -s 200 -t 5000`

## Adding new tests

1. Come up with a hyphenated name that represents the framework and/or language for which you are creating a new REST API.
   (Use the existing directory names as a guideline.)
1. Create a new subdirectory under *examples* with that same name.
1. Put all your API code in that directory.
1. Make sure that your API follows the **API Requirements** below.
1. Add a new property (with the same hyphenated name as your new directory) to the `testMetadata` object in *test-metadata.js*,
   containing the configuration options for the new API.
1. Execute the test (see the **Execution** directions above) and ensure that all tests pass.
1. If manual setup steps are required in order for your new API to be fully functional,
   include them in a readme.md file in your API subdirectory.
   (Use the existing readme.md files in other API subdirectories as a guideline).

## API Requirements

### For the sake of simplicity:

The functionality below is considered out of scope for this particular exercise,
and should be omitted in order to reduce clutter.

 - Do not require authorization
 - Do not perform data validation
 - Do not include logging
 - Do not persist todos to a database or other permanent storage (just store them in memory)

### For the sake of consistency:

Adhering to the following requirements helps ensure that
(a) your API can be easily compared to other APIs, and
(b) the Mocha automated test script will work for your API with minimal configuration needed.

 - The API resource name must be `todos` (e.g., `http://localhost:8888/todos`)
 - The API must use JSON with camelCased property names (see **Todo Properties** below)
 - The API must support the operations listed below under **API Operations** below

### Todo Properties

Todo instances should only consist the following two properties.
(Note that the `id` property gets set at the server, so a new todo instance about to get POSTed to the server will only have a `title`.)

 - **id:** (required) An integer starting at 1 and auto-incrementing by 1
 - **title:** (required) The text of the todo item

### API Operations

 - **GET /todos** should return a *200 OK* response containing an array of todo instances (e.g, `[]` when empty, or `[{"id":1,"title":"go round mums"}]` with one item)

 - **GET /todos/{id}** should return a *200 OK* response containing the todo with the corresponding `id` (e.g., `GET /todos/1` would return `{"id":1,"title":"go round mums"}`

 - **POST /todos** should accept a body containing JSON for one new todo, without an `id` set (e.g., `{"title":"go round mums"}`), set the todo's `id` property with
   the next sequential id, and return an *201 Created* response with the todo instance, including the new id (e.g., `{"id":1,"title":"go round mums"}`)

 - **PUT /todos/{id}** should accept a body containing JSON for one updated todo (the `id` in the JSON should match the `id` in the URL), replace the corresponding todo
   in the todos array on the server, and return an empty *204 No Content* response

 - **DELETE /todos/{id}** should remove the specified todo from the todos array on the server, and return an empty *204 No Content* response

 - **DELETE /todos** should remove all todos from the todos array on the server, reset the next available id to 1, and return an empty *204 No Content* response
   (NOTE: This "delete everything" operation would not typically be recommended for a "normal" REST API, but is included here for ease of testing)

# TodoREST

Provides working examples of a basic REST API in a variety of different frameworks & languages.

Also provides a shared [Mocha](http://mochajs.org/) test script to verify that any of the example REST APIs is working correctly.

Inspired by Addy Osmani's [TodoMVC](https://github.com/tastejs/todomvc) project.

## Setup

Confirmed to work on Windows and Linux; should presumably work on Mac OS X as well.

1. Download and install [Node.js](http://nodejs.org/download/) if you have not already done so
1. Download the source code using either of the options below

**Download via git**

1. Download and install [git](http://git-scm.com/downloads) if you have not already done so
1. Open a console window in the directory where you want to place the *todo-rest* project directory
1. Execute the following command line: `git clone https://github.com/troygizzi/todo-rest.git`

**Download manually**

1. Use the **Download ZIP** button to the right
1. Extract the ZIP file contents into the directory of your choice

## Executing the test for one of the example APIs

NOTE: If this is the first time running the test on a particular workstation, follow the **One-time initial setup** steps below first.

1. Edit the *test-name.txt* file to contain a single test/API name (e.g., `node-plain`), which corresponds to an *examples* subdirectory (and also a `testMetadata` object property in *test-metadata.js*)
1. Open a console window in the *test* subdirectory
1. Execute the following command line: `mocha spec.js -b -s 200 -t 5000`

**One-time initial setup**

1. Open a console window in the *test* subdirectory
1. Install mocha globally (`sudo npm install -g mocha` on Linux; `npm install -g mocha` on Windows or Mac OS X)
1. Install the local dependencies listed in *package.json* by executing `npm install`

> If npm complains that it couldn't parse *package.json*, but its contents validate correctly at [jsonlint.com](http://jsonlint.com/), try deleting *package.json* and then installing each dependency manually as follows:
>
>     npm install lodash-node
>     npm install es6-promise-polyfill
>     npm install chai

## Adding new REST API examples

Before adding a new REST API example, make sure that (1) the framework and language you plan to use is not already covered by an existing API in the *examples* subdirectory, and (2) your API will implement follow the standard example API requirements listed under **API Requirements** below.

1. Come up with a hyphenated name that represents the framework and/or language for which you are creating a new REST API (use the existing directory names as a guideline)
1. Create a new subdirectory under *examples* with that same name
1. Put all your API code in that directory
1. Add a new property (with the same hyphenated name as your new directory) to the `testMetadata` object in *test-metadata.js*, containing the configuration options for the new API
1. Execute the test (see the **Executing the test for one of the example APIs** directions above) and ensure that all tests pass
1. If manual setup steps are required in order for your new API to be fully functional, include them in a readme.md file in your API subdirectory (use the existing readme.md files in other API subdirectories as a guideline)

## API Requirements

Remember, the purpose of TodoREST is not to design the best REST API ever seen by devkind. The purpose is to provide simple, working examples of the *same basic REST API*, written in a variety of different frameworks and languages, in order to help others decide which framework/language they might want to use to implement their own REST APIs, and to give them a decent structure from which to begin.

**For the sake of simplicity:**

The functionality below is considered out of scope for this particular exercise, and should be omitted in order to reduce clutter.

 - Do not require authorization
 - Do not persist todos to a database or other permanent storage (just store them in memory)
 - Do not perform any logging

**For the sake of consistency:**

Adhering to the following requirements helps ensure that (a) your API can be easily compared to other APIs, and (b) the Mocha automated test script will work for your API the same way it does for the others.

 - The API resource name will be `todos` (as in `http://localhost:8888/todos`)
 - The API will use JSON serialization with camelCase property names (see **Todo properties** below)
 - The API will support the operations listed under **API operations** below

**Todo properties:**

Todo instances should only consist the following two properties.

> Note that the `id` property gets set at the server, so a new todo instance at the client (which has not been posted to the server yet) will only have a `title` property.

 - **id:** (required) An integer starting at 1 and auto-incrementing by 1
 - **title:** (required) The text of the todo item

**API operations:**

 - **GET /todos** - returns a *200 OK* response containing an array of todo instances (e.g, `[]` when empty, or `[{"id":1,"title":"go round mums"}]` with one item)

 - **GET /todos/{id}** - returns a *200 OK* response containing the todo with the corresponding `id` (e.g., `GET /todos/2` would return `{"id":2,"title":"get Liz back"}`

 - **POST /todos** - accepts a body containing JSON for one new todo, without an `id` set (e.g., `{"title":"sort life out"}`), set the todo's `id` property with the next sequential id, and returns a *201 Created* response containing the todo instance, including the new id (e.g., `{"id":3,"title":"sort life out"}`)

 - **PUT /todos/{id}** - accepts a body containing JSON for one updated todo (the `id` in the JSON must match the `id` in the URL), replaces the corresponding todo in the todos array on the server, and returns an empty *204 No Content* response

 - **DELETE /todos/{id}** - removes the specified todo from the todos array on the server, and returns an empty *204 No Content* response

 - **DELETE /todos** - removes all todos from the todos array on the server, resets the next available id to 1, and returns an empty *204 No Content* response (NOTE: This "delete everything" operation would not typically be recommended for a "normal" REST API, but is included here for ease of testing)

Example REST APIs will also implement the following behaviors for error conditions.

- For any of the above operations that involve `id`, if the id in the querystring does not match the id of any todo on the server, the API will return a response with a status code of 404 (Not Found), and an empty response body

- For POST operations, if the todo passed in from the client contains an `id` property with any value other than `undefined` or `null`, the API will return a response with a status code of 400 (Bad Request), and the following plain text in the response body:

  > New resource instances should not have an `id` property set. If you are trying to update an existing resource instance, use the PUT method instead.

- For PUT operations, if the `id` in the querystring does not match the `id` in the request body, the API will return a response with a status code of 400 (Bad Request), and the following plain text in the response body:

  > The id in the querystring did not match the id in the request body.

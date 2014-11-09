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
1. Execute the following command line: `git clone https://github.com/lab147/todo-rest.git`

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
1. Add a new property (with the same hyphenated name as your new directory) to the `testMetadata` object in *test-metadata.js*,
   containing the configuration options for the new API.
1. Execute the test (see the **Execution** directions above) and ensure that all tests pass.
1. If manual setup steps are required in order for your new API to be fully functional,
   include them in a readme.md file in your API subdirectory.
   (Use the existing readme.md files in other API subdirectories as a guideline).
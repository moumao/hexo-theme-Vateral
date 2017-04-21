# gulp-jslint [![Build Status](https://img.shields.io/travis/karimsa/gulp-jslint/master.svg?maxAge=2592000)](https://travis-ci.org/karimsa/gulp-jslint) [![View on NPM](http://img.shields.io/npm/dm/gulp-jslint.svg?style=flat)](http://npmjs.org/package/gulp-jslint) [![code climate](http://img.shields.io/codeclimate/github/karimsa/gulp-jslint.svg?style=flat)](https://codeclimate.com/github/karimsa/gulp-jslint) [![code coverage](http://img.shields.io/codeclimate/coverage/github/karimsa/gulp-jslint.svg?style=flat)](https://codeclimate.com/github/karimsa/gulp-jslint)

It's JSLint for Gulp.js.

[![NPM](https://nodei.co/npm/gulp-jslint.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-jslint/)

Supports `node >= 0.10.x`.

## Table of Contents

 - [Installation](#installation)
 - [Usage](#usage)
    - [Directives](#directives)
 - [Reporters](#reporters)
    - [Custom Reporters](#custom-reporters)
 - [Support and Licensing](#support-and-licensing)

## Installation

Simply install with npm by running `npm install gulp-jslint`.

## Usage

```javascript
var gulp = require('gulp');
var jslint = require('gulp-jslint');

gulp.task('default', function () {
    return gulp.src(['source.js'])
            .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
            .pipe(jslint.reporter( 'my-reporter' ));
});
```

If you would like to specify a custom jslint edition to use, set the property 'edition' in your directives object.
These versions should follow what the package node-jslint expects or this property can be set to a pre-loaded jslint
function.

### Directives

All directives being passed to the `jslint()` function are standard JSLint directives (for a list of directives,
see [the official JSLint docs](http://www.jslint.com/help.html)).

However, to supply a list of global variables for your code, use the directive 'predef' or 'global' like so ('global'
is an alias of 'predef' but 'predef' will be prefered since it is the official JSLint standard):

```javascript
gulp.task('default', function () {
    return gulp.src(['source.js'])
            .pipe(jslint({
                predef: [ 'a_global' ],
                global: [ 'a_global' ]
            }));
});
```

*Please see `gulpfile.js` for a more extensive sample gulpfile.*

## Reporters

By default, two reporters are provided by gulp-jslint. The first is the default reporter (appropriately named 'default')
and the second report is the popular 'jshint-stylish' (named 'stylish').

To use either of these reporters, provide the name of the reporter followed by whatever arguments they expect to the function
`jslint.reporter()`.

**For example:**

```javascript
gulp.task('default', function () {
    return gulp.src(['source.js'])
            .pipe(jslint())
            .pipe(jslint.reporter('default', errorsOnly))
            .pipe(jslint.reporter('stylish', options));
});
```

It's probably a good idea to use something like `path.basename()` on the `file` property to avoid lots of garbage in the
command-line (i.e. path.basename('/path/to/index.js') === 'index.js').

### Custom Reporters

Custom reporters should be either be synchronous or streams. Either way, the reporter will receive a `results` object and can
output its report onto the console/logfile the way it wishes.

The results object will contain the following properties:

 - *filename*: the absolute path to the file being linted.
 - *success*: a boolean value representing whether the linting passed.
 - *errors*: an array of JSLint errors. Each element will contain the properties:
    - *name*: the string 'JSLintError'.
    - *column*: the column number of the error.
    - *line*: the line number of the error.
    - *code*: a code relating to the error.
    - *message*: a message describing the error.

## Support and Licensing

Copyright (C) 2014-2016 Karim Alibhai.
Code is licensed under the MIT license.

Please use the official issues section in GitHub to post issues or feature requests.
Stars and helpful comments are much appreciated! :)

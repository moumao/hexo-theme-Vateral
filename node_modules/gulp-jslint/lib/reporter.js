/**
 * lib/reporter.js - gulp-jslint
 * Copyright (C) 2014-2016 Karim Alibhai.
 */

'use strict';

var map = require('map-stream'),
    gutil = require('gulp-util'),
    Stream = require('stream').Stream,
    supported = {
        'default': require('./reporters/default.js'),
        stylish: require('./reporters/stylish.js')
    },
    fixIndex = function (jslint) {
        // it seems that JSLint is a bit inconsistent about
        // how it reports column numbers and messages. this
        // forces standardization between the reporters
        jslint.errors = jslint.errors
              .filter(function (err) { return err; })
              .map(function (i) {
                  i.column = i.column === undefined ? i.character : i.column;
                  i.column = i.column === undefined ? '?' : i.column;
                  i.message = i.message || i.reason;
                  return i;
              })
              .sort(function (a, b) {
                  return a.column - b.column;
              })
              .sort(function (a, b) {
                  return a.line - b.line;
              });

        return jslint;
    };

module.exports = function (name, options) {
    options = options !== undefined ? options : {};
    var reporter = name || 'default';

    // if the report is a function, then it does not need any options
    if (typeof reporter !== 'function') {
        // if the given reporter is bundled with gulp-jslint,
        // load it. otherwise, try to 'require' the given reporter.
        var createReporter = supported.hasOwnProperty(name) ? supported[name] : require(name);

        // create a reporter with the given options object
        reporter = createReporter(options);
    }

    // if the reporter is not a stream, wrap it with a map-stream
    if (!(reporter instanceof Stream)) {
        var stream = map(function (source, next) {
            var value = reporter(fixIndex(source.jslint));
            next(source.jslint.success ? null : new gutil.PluginError('gulp-jslint', 'Failed to lint: ' + source.path), value);
        });
        return stream;
    }

    // for stream reporters, just return
    return reporter;
};

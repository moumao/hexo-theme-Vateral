/**
 * lib/lint.js - gulp-jslint
 * Copyright (C) 2014-2016 Karim Alibhai.
 */

'use strict';

var PluginError = require('gulp-util').PluginError,
    LintStream = require('jslint').LintStream,
    map = require('map-stream'),
    rc = require('rc');

/**
 * The outer linting function that creates an output
 * object.
 *
 * @param options a JSON object containing defined options
 */
module.exports = function (options) {
    // fallback to empty object
    options = options || {};

    // extend .jslintrc; give options
    // the priority for directives
    options = rc('jslint', options);

    // use 'global' for consistency prefer 'predef' because of JSLint
    options.predef = options.predef || options.global || [];

    // freeze to user's prefered edition or use latest
    var edition = options.edition || 'latest';
    options.edition = edition;

    // remove edition functions from the options because
    // node-jslint does not like it
    if (typeof edition === 'function') {
        delete options.edition;
    }

    // create a new lint stream
    var lintStream = new LintStream(options);

    // if instead of an edition string a function is provided,
    // then we need to replace the jslint function in the stream
    if (typeof edition === 'function') {
        lintStream.JSlint = edition;
    }

    // map the incoming vinyl object to the object
    // expected by the lint stream
    var stream = map(function (data, next) {
        var source = data.source;

        // handle bad inputs
        if (source.isNull() || source.isStream()) {
            // send error on stream, but not on null
            data.done(source.isStream() ? new PluginError('gulp-jslint', 'Not sure how to handle stream as input file.') : null);

            // drop from lintable stream
            return next();
        }

        // map over the data
        next(null, {
            file: data,
            body: source.contents.toString('utf8')
        });
    });

    // begin linting
    stream.pipe(lintStream)

        // map the lint stream results object back to the
        // vinyl object expected by the reporter and rest
        // of the gulp stream
        .pipe(map(function (data, next) {
            var source = data.file.source;

            // map over the properties required by a lint reporter
            source.jslint = {
                filename: source.path,
                success: data.linted.ok === true,
                errors: data.linted.errors
            };

            // continue the stream process
            next(null, source);
            data.file.done();
        }));

    // create a gulp-able stream that allows for chunked linting
    return map(function (source, next) {
        stream.write({
            source: source,
            done: function (err) {
                if (err) {
                    next(err);
                } else {
                    next(null, source);
                }
            }
        });
    });
};

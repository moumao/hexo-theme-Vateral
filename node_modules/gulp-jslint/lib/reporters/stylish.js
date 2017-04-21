/**
 * lib/reporters/stylish.js - gulp-jslint
 * Copyright (C) 2014-2016 Karim Alibhai.
 */

'use strict';

var stylish = require('jshint-stylish').reporter,
    path = require('path');

module.exports = function (options) {
    // ensure that options are a proper object
    options = typeof options === 'object' ? options : {};

    // wrapper to map over jslint results object to output
    // similar to jshint's output
    return function (results) {
        return stylish(results.errors.map(function (error) {
            return {
                file: path.basename(results.filename),
                error: {
                    code: results.success ? 'I' : 'E',
                    line: error.line,
                    character: error.column,
                    reason: error.message
                }
            };
        }), options);
    };
};

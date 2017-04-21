/**
 * gulpfile.js
 * For build instructions, please see README.md.
 *
 * Copyright (C) 2014-2016 Karim Alibhai.
 **/

'use strict';

var gulp = require('gulp'),
    jslint = require('./');

// lint all code
gulp.task('default', function () {
    return gulp.src(['gulpfile.js', 'index.js', 'lib/**/*.js'])

        // pass your directives
        // as an object
        .pipe(jslint({
            // these directives can
            // be found in the official
            // JSLint documentation.
            node: true,
            es6: false,
            white: true,

            // you can also set global
            // declarations for all source
            // files like so:
            global: [],
            predef: []

            // both ways will achieve the
            // same result; predef will be
            // given priority because it is
            // promoted by JSLint
        }))

        // pass in your prefered reporter like so:
        .pipe(jslint.reporter('default', true));
});

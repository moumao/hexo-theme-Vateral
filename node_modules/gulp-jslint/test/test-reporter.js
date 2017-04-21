/**
 * test-reporter.js
 * Literally a test reporter.
 *
 * Copyright (C) 2014 Karim Alibhai.
 **/

(function () {
    module.exports = function (evt) {
        global.GULP_JSLINT_REPORTER = evt;
    };
}());
'use strict';

var gutil = require('gulp-util'),
  through = require('through2'),
  htmlclean = require('htmlclean');

module.exports = function(options) {
  return through.obj(function(file, encoding, callback) { // eslint-disable-line consistent-return
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new gutil.PluginError('gulp-htmlclean', 'Streaming not supported'));
    }

    var content = htmlclean(file.contents.toString(), options);
    // Check `allocUnsafe` to make sure of the new API.
    file.contents = Buffer.allocUnsafe && Buffer.from ? Buffer.from(content) : new Buffer(content);
    callback(null, file);
  });
};

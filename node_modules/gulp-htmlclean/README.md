# gulp-htmlclean

[![npm](https://img.shields.io/npm/v/gulp-htmlclean.svg)](https://www.npmjs.com/package/gulp-htmlclean) [![GitHub issues](https://img.shields.io/github/issues/anseki/gulp-htmlclean.svg)](https://github.com/anseki/gulp-htmlclean/issues) [![David](https://img.shields.io/david/anseki/gulp-htmlclean.svg)](package.json) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE-MIT)

This [gulp](http://gulpjs.com/) plugin is wrapper of [htmlclean](https://github.com/anseki/htmlclean).

* [Grunt](http://gruntjs.com/) plugin: [grunt-htmlclean](https://github.com/anseki/grunt-htmlclean)
* [webpack](https://webpack.js.org/) loader: [htmlclean-loader](https://github.com/anseki/htmlclean-loader)

**If you want to just clean files, [Command Line Tool](https://github.com/anseki/htmlclean-cli) is easy way.**

Simple and safety HTML/SVG cleaner to minify without changing its structure.  
See [htmlclean](https://github.com/anseki/htmlclean) for options and more information about htmlclean.

## Getting Started

```shell
npm install gulp-htmlclean --save-dev
```

## Usage

`gulpfile.js`

```js
var gulp = require('gulp'),
  htmlclean = require('gulp-htmlclean');

gulp.task('default', function() {
  return gulp.src('./develop/*.html')
    .pipe(htmlclean({
        protect: /<\!--%fooTemplate\b.*?%-->/g,
        edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
      }))
    .pipe(gulp.dest('./public_html/'));
});
```

See [htmlclean](https://github.com/anseki/htmlclean#options) for the options.

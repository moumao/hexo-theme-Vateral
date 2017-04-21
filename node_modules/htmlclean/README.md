# htmlclean

[![npm](https://img.shields.io/npm/v/htmlclean.svg)](https://www.npmjs.com/package/htmlclean) [![GitHub issues](https://img.shields.io/github/issues/anseki/htmlclean.svg)](https://github.com/anseki/htmlclean/issues) [![dependencies](https://img.shields.io/badge/dependencies-No%20dependency-brightgreen.svg)](package.json) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE-MIT)

***Since v3, the CLI was separated into [htmlclean-cli](https://github.com/anseki/htmlclean-cli).***

---

* Command Line Tool: [htmlclean-cli](https://github.com/anseki/htmlclean-cli)
* [Grunt](http://gruntjs.com/) plugin: [grunt-htmlclean](https://github.com/anseki/grunt-htmlclean)
* [gulp](http://gulpjs.com/) plugin: [gulp-htmlclean](https://github.com/anseki/gulp-htmlclean)
* [webpack](https://webpack.js.org/) loader: [htmlclean-loader](https://github.com/anseki/htmlclean-loader)

Simple and safety HTML/SVG cleaner to minify without changing its structure.

For example, more than two whitespaces (even if those are divided by tags) in a line are reduced.

Before:

```html
<p>The <strong> clean <span> <em> HTML is here. </em> </span> </strong> </p>
```

After:

```html
<p>The <strong>clean <span><em>HTML is here.</em></span></strong></p>
```

The whitespace that was on the right side of the `<strong>` was removed, and one on the left side was kept. And whitespaces on the both side of the `<em>` were removed.

For example, unneeded whitespaces in path data of SVG are reduced. In the case of this SVG file, 4,784 bytes were reduced without changing its structure:

<img src="https://rawgit.com/anseki/htmlclean/master/Ghostscript_Tiger.svg" width="300" height="300">

## Removing

htmlclean removes following texts.

+ Leading and trailing whitespaces (tabs and line-breaks are included)
+ Unneeded whitespaces between HTML/SVG tags
+ More than two whitespaces (reduced to one space)
+ HTML/SVG comments
+ Unneeded whitespaces, meaningless zeros, numbers, signs, etc. in path data of SVG (e.g. `d` attribute of `path` element, `path` attribute of `animateMotion` element, etc.)

## Protecting

Following texts are protected (excluded from the [Removing](#removing) list).

+ Texts in `textarea`, `script` and `style` elements, and text nodes in `pre` elements
+ Quoted texts in tag attributes except path data of SVG
+ Texts in SSI tags (PHP, JSP, ASP/ASP.NET and Apache SSI)
+ IE conditional comments (e.g. `<!--[if lt IE 7]>`)
+ Texts between `<!--[htmlclean-protect]-->` and `<!--[/htmlclean-protect]-->`
+ Texts that is matched by [`protect`](#protect) option

## Usage

```js
cleanHtml = htmlclean(sourceHtml[, options])
```

`require('htmlclean')` returns a Function. This Function accepts a HTML/SVG source, and returns a clean HTML/SVG source. You can specify an `options` Object for second argument (see [Options](#options)).

```js
var htmlclean = require('htmlclean');
html = htmlclean(html);

// Or
html = require('htmlclean')(html);
```

### Options

You can specify an `options` Object for second argument. This Object can have following properties.

#### `protect`

*Type:* RegExp or Array

Texts which are matched to this RegExp are protected in addition to the [Protecting](#protecting) list. Multiple RegExps can be specified via an Array.

#### `unprotect`

*Type:* RegExp or Array

Texts which are matched to this RegExp are cleaned even if those text are included in the [Protecting](#protecting) list. Multiple RegExps can be specified via an Array.

For example, a HTML source as template in `<script type="text/x-handlebars-template">` is cleaned via following code:

```js
html = htmlclean(html, {
  unprotect: /<script [^>]*\btype="text\/x-handlebars-template"[\s\S]+?<\/script>/ig
});
```

The `x-handlebars-template` in the `type` attribute above is a case of using Template Framework [Handlebars](http://handlebarsjs.com/). e.g. [AngularJS](https://angularjs.org/) requires `ng-template` instead of it.

*NOTE:* The RegExp has to match to a text which is not a part of protected texts. For example, the RegExp matches a `color: red;` in a `<style>` element, but this is not cleaned because all texts in the `<style>` element are protected. A `color: red;` is a part of the protected text. The RegExp has to match to a text which is all of a `<style>` element like `/<style[\s\S]+?<\/style>/`.

#### `edit`

*Type:* Function

This Function more edits the HTML/SVG source.  
Protected texts are hidden from the HTML/SVG source, and the HTML/SVG source is passed to this Function. Therefore, this Function doesn't break the protected texts. The HTML/SVG source which returned from this Function is restored.

*NOTE:* Markers `\fID\x07` (`\f` is "form feed" `\x0C` code, `\x07` is "bell", `ID` is number) are inserted to the HTML/SVG source instead of protected texts. This Function can remove those markers, but can't add new markers. (Invalid markers will be just removed.)

### Example

See a source HTML file and result HTML files in the `examples` directory.

```js
var htmlclean = require('htmlclean'),
  fs = require('fs'),
  htmlBefore = fs.readFileSync('./before.html', {encoding: 'utf8'});

var htmlAfter1 = htmlclean(htmlBefore);
fs.writeFileSync('./after1.html', htmlAfter1);

var htmlAfter2 = htmlclean(htmlBefore, {
  protect: /<\!--%fooTemplate\b.*?%-->/g,
  unprotect: /<script [^>]*\btype="text\/x-handlebars-template"[\s\S]+?<\/script>/ig,
  edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
});
fs.writeFileSync('./after2.html', htmlAfter2);
```

## Note

### Malformed Nested Tags, and Close Tags in Script

htmlclean may not be able to parse malformed nested tags like `<p>foo<pre>bar</p>baz</pre>` precisely. Also, close tags in script code such as `<script>var foo = '</script>';</script>`, `?>` in PHP code, etc..  
Some language parsers also mistake by those, then they recommend us to write code like `'<' + '/script>'`. This is better even if htmlclean is not used.

### SSI Tags in HTML Comments

htmlclean removes HTML/SVG comments that include SSI tags like `<!-- Info for admin - Foo:<?= expression ?> -->`. I think it's no problem because htmlclean is used to minify HTML. If that SSI tag includes a important code for logic, use [`protect`](#protect) option, or `<!--[htmlclean-protect]-->` and `<!--[/htmlclean-protect]-->`.

### htmlclean Job

htmlclean never changes structure of document even if elements or attributes look like meaningless, because those might be used by your program, and the structuring is not job htmlclean should do. It should prevent unexpectedly breaking the data after all your efforts.  
If you would like to enforce rules relating to code style, check out documents such as code style guide.

## See Also

If you want to control details of editing, [HtmlCompressor](http://code.google.com/p/htmlcompressor/), [HTMLMinifier](https://github.com/kangax/html-minifier) and others are better choice.

---

Thanks for images: [Wikimedia Commons](https://commons.wikimedia.org/)

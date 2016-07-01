# Module Import

<a href="https://github.com/postcss/postcss"><img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="80" height="80" align="right"></a>

[![npm][npm-image]][npm-url] [![bower][bower-image]][bower-url]
[![ci][ci-image]][ci-url] [![gitter][gitter-image]][gitter-url]

[Module Import] is a [PostCSS] plugin that inlines `@import` statements as [CSS
Modules] in CSS, giving you all the modular benefits while also maintaining a
separation between style, markup, and functionality.

Module Import also supports sugary imports like Sass and automatically looks
for stylesheets within npm and Bower packages. It can even generate files if
they don’t already exist to further reduce development time.

```css
/* before */

@import "module/_some-module";
@import "module/_another-module";

/* before: module/_some-module.css */

.container {
	background-color: red;
}

/* before: module/another-module.css */

.container {
	background-color: blue;
}

/* after */

._container_eosv8_1 {
    background-color: red
}
._container_wpmzm_1 {
    background-color: blue
}
```

**Manifest JSON**

```json
{
	"module/_some-module.css": {
		"container": "_container_eosv8_1"
	},
	"module/_another-module.css": {
		"container": "_container_wpmzm_1"
	}
}
```

Now your modules are mixed into the same file while preserving access to their
parts.

##### WordPress Example

```php
<?php

// get the path to the modules json
$css_modules_path = get_template_directory() . '/assets/css/theme.json';

// load the modules json
$css_modules = json_decode( file_get_contents( $css_modules_path ), true );

// get the modules names for a particular path
$article_cn = $css_modules[ 'module/_main-article.css' ];

?>
<article class="<?php echo esc_attr( $article_cn['container'] ); ?>">
    <h1 class="<?php echo esc_attr( $article_cn['title'] ); ?>">My style is scoped.</h1>
</article>
```

### Usage

Follow these steps to use [Module Import].

Add [Module Import] to your build tool:

```bash
npm install postcss-module-import --save-dev
```

##### Node

```js
require('postcss-module-import')({ /* options */ }).process(YOUR_CSS);
```

##### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Load [Module Import] as a PostCSS plugin:

```js
postcss([
    require('postcss-module-import')({ /* options */ })
]);
```

##### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [Module Import] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
    return gulp.src('./css/src/*.css').pipe(
        postcss([
            require('postcss-module-import')({ /* options */ })
        ])
    ).pipe(
        gulp.dest('./css')
    );
});
```

##### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Enable [Module Import] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
    postcss: {
        options: {
            processors: [
                require('postcss-module-import')({ /* options */ })
            ]
        },
        dist: {
            src: 'css/*.css'
        }
    }
});
```

### Options

##### `plugins`

Type: `Array`  
Default: `[]`

A list of PostCSS plugins to run on each `@import` before being processed by
CSS Modules.

##### `pluginsAfter`

Type: `Array`  
Default: `[]`

A list of PostCSS plugins to run on each `@import` after being processed by
CSS Modules.

##### `importOpts`

Type: `Object`  
Default: `{}`

The options passed into the [PostCSS Partial Import] plugin.

##### `moduleOpts`

Type: `Object`  
Default: `{}`

The options passed into the [PostCSS Modules] plugin.

[bower-image]:  https://img.shields.io/bower/v/postcss-module-import.svg?style=flat-square
[bower-url]:    https://libraries.io/bower/postcss-module-import
[ci-image]:     https://img.shields.io/travis/jonathantneal/postcss-module-import.svg?style=flat-square
[ci-url]:       https://travis-ci.org/jonathantneal/postcss-module-import
[gitter-image]: https://img.shields.io/gitter/room/postcss/postcss.svg?style=flat-square
[gitter-url]:   https://gitter.im/postcss/postcss
[npm-image]:    https://img.shields.io/npm/v/postcss-module-import.svg?style=flat-square
[npm-url]:      https://www.npmjs.com/package/postcss-module-import

[Gulp PostCSS]:  https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]:       https://github.com/postcss/postcss

[CSS Modules]: https://github.com/css-modules/css-modules
[PostCSS Modules]: https://github.com/css-modules/postcss-modules#usage
[PostCSS Partial Import]: https://github.com/jonathantneal/postcss-partial-import#options

[Module Import]: https://github.com/jonathantneal/postcss-module-import

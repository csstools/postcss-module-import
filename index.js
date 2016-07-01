var assign  = require('object-assign');
var fs      = require('fs-promise');
var path    = require('path');
var postcss = require('postcss');

var importPlugin = require('postcss-partial-import');
var modulePlugin = require('postcss-modules');

module.exports = postcss.plugin('postcss-module-import', function (rawOpts) {
	// manifest directory
	var manifestDir = '';

	// manifest JSON
	var manifestJSON = {};

	// manifest JSON path
	var manifestJSONPath = '';

	// CSS Modules plugin options
	var moduleOpts = assign({}, rawOpts && rawOpts.moduleOpts);

	// method used by CSS Modules plugin
	var moduleOptsGetJSON = moduleOpts.getJSON;

	// whether the aforementioned method exists
	var moduleOptsGetJSONIsFunction = typeof moduleOptsGetJSON === 'function';

	moduleOpts.getJSON = function (rawPath, moduleJSON) {
		// relative path to the module
		var relativePath = path.relative(manifestDir, rawPath);

		// write the module JSON to the relative path in manifest JSON
		manifestJSON[relativePath] = moduleJSON;

		if (moduleOptsGetJSONIsFunction) {
			// run the raw method
			moduleOptsGetJSON(rawPath, moduleJSON);
		}
	};

	// initialize the CSS Import plugin options
	var importOpts = assign({}, rawOpts && rawOpts.importOpts);

	// set any additional plugins run before or after CSS Modules
	importOpts.plugins = [].concat(importOpts.plugins || [], modulePlugin(moduleOpts), importOpts.pluginsAfter || []);

	// modules import plugin pack
	return postcss([
		function (css) {
			// manifest base name
			var manifestName = path.basename(css.source.input.file, path.extname(css.source.input.file));

			// manifest directory
			manifestDir = path.dirname(css.source.input.file);

			// manifest JSON path
			manifestJSONPath = path.join(manifestDir, manifestName + '.json');
		},
		importPlugin(importOpts),
		function () {
			// stringified JSON
			var manifestJSONString = JSON.stringify(manifestJSON);

			// promise the manifest JSON will be written
			var writeFilePromise = fs.writeFile(manifestJSONPath, manifestJSONString);

			return writeFilePromise;
		}
	]);
});

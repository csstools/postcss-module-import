var fs      = require('fs-promise');
var path    = require('path');
var postcss = require('postcss');
var test    = require('ava');
var plugin  = require('.');

var testdir = './test';

var tests = {
	'postcss-module-import': {
		'basic': {}
	}
};

Object.keys(tests).forEach(function (name) {
	var parts = tests[name];

	var fixtures = Object.keys(parts);

	fixtures.map(function (fixture) {
		var message    = parts[fixture].message;
		var options    = parts[fixture].options;
		var warning    = parts[fixture].warning || 0;

		var baseName   = fixture.split(':')[0];
		var testName   = fixture.split(':').join('.');

		var sourcePath = path.resolve(path.join(testdir, baseName + '.css'));
		var resultPath = path.resolve(path.join(testdir, testName + '.result.css'));
		var expectPath = path.resolve(path.join(testdir, testName + '.expect.css'));

		var ensureFilePromises = [
			fs.ensureFile(sourcePath),
			fs.ensureFile(expectPath)
		];

		var ensureFilePromisesPromise = Promise.all(ensureFilePromises);

		test([name, message].join(': '), function (t) {
			return ensureFilePromisesPromise.then(function () {
				var sourcePromise = fs.readFile(sourcePath, 'utf8');

				return sourcePromise;
			}).then(function (sourceCSS) {
				var plugins  = [plugin(options)];
				var processor = postcss(plugins);

				var processorPromise = processor.process(sourceCSS, {
					from: sourcePath
				});

				return processorPromise;
			}).then(function (result) {
				var resultCSS = result.css;
				var warnings  = result.warnings();

				var expectPromise = fs.readFile(expectPath, 'utf8').then(function (expectCSS) {
					t.deepEqual(expectCSS, resultCSS);
					t.deepEqual(warnings.length, warning);

					return fs.writeFile(resultPath, resultCSS);
				});

				if (parts[fixture].after) {
					expectPromise = expectPromise.then(parts[fixture].after);
				}

				return expectPromise;
			});
		});
	});
});

'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnCheckout = function(test){
	test.expect(2);

	var filePath = $path.resolve('./test/test/checkout/deepinner.js');

	test.ok(
		$grunt.file.isFile(filePath),
		'checkout "repo://test/deep/inner" to "./test/test/checkout" .'
	);
	test.equal(
		$grunt.file.read(filePath),
		'deepinner',
		'checkouted file is same as online file. '
	);

	test.done();
};


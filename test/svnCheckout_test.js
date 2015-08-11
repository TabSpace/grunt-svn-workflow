'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnCheckout = function(test){
	test.expect(2);
	
	var folderPath = $path.resolve('./test/test/checkout/');
	var filePath = $path.resolve('./test/test/checkout/inner/demo.js');

	test.ok(
		$grunt.file.isFile(filePath),
		'checkout "repo://checkout" to "./test/test/checkout" .'
	);
	test.equal(
		$grunt.file.read(filePath),
		'checkout',
		'checkouted file is same as online file. '
	);

	test.done();
};


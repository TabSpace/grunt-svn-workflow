'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnCheckout = function(test){
	test.expect(2);
	
	var filePath = $path.resolve('./test/test/checkout/inner/demo.js');

	test.ok(
		$grunt.file.isFile(filePath),
		'Should checkout "repo://checkout" to "./test/test/checkout" .'
	);
	test.equal(
		$grunt.file.read(filePath),
		'checkout',
		'Checkouted file should is same as online file. '
	);

	var folderPath = $path.resolve('./test/test/checkout/');
	$grunt.file.delete(folderPath);

	test.done();
};


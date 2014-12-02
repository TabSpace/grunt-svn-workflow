'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnCheckout = function(test){
	test.expect(4);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/trunk')),
		'Shout checkout "./test/trunk" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/dist')),
		'Shout checkout "./test/dist" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/tools/temp/trunk')),
		'Shout checkout "./test/tools/temp/trunk" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/tools/temp/online')),
		'Shout checkout "./test/tools/temp/online" .'
	);
	test.done();
};


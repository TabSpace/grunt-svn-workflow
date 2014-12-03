'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnInit = function(test){
	test.expect(7);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/trunk')),
		'checkout "repo://dev/trunk" to  "./test/trunk" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/trunk/html')),
		'we have folder "trunk/html" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/trunk/css')),
		'we have folder "trunk/css" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/trunk/js')),
		'we have folder "trunk/js" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/dist')),
		'checkout "repo://online/trunk" to "./test/dist" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/tools/temp/devtags')),
		'checkout "repo://dev/tags" to "./test/tools/temp/trunk" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/tools/temp/onlinetags')),
		'checkout "repo://online/tags" to "./test/tools/temp/onlinetags" .'
	);
	test.done();
};


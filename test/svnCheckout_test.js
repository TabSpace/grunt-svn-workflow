'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnCheckout = function(test){
	test.expect(5);

	var trunkJsPath = $path.resolve('./test/trunk/js/test.js');
	var updateJsPath = $path.resolve('./test/tools/temp/trunk/js/test.js');

	test.ok(
		$grunt.file.isFile(trunkJsPath),
		'commit file "./test/trunk/js/test.js" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/tools/temp/trunk')),
		'checkout "repo://dev/trunk" to "./test/tools/temp/trunk" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/tools/temp/online')),
		'checkout "repo://online/trunk" to "./test/tools/temp/online" .'
	);
	test.ok(
		$grunt.file.isFile(updateJsPath),
		'update file "./test/tools/temp/trunk/js/test.js" .'
	);
	test.equal(
		$grunt.file.read(updateJsPath),
		$grunt.file.read(trunkJsPath),
		'update file is same as commit file. '
	);
	
	test.done();
};


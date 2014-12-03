'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnCommit = function(test){
	test.expect(7);

	var trunkJsPath = $path.resolve('./test/trunk/js/test.js');
	var onlineJsPath = $path.resolve('./test/tools/temp/online/js/test.js');
	var distJsPath = $path.resolve('./test/dist/js/test.js');
	var repository = $grunt.config.get('svnConfig.repository');
	var text = $grunt.file.read(trunkJsPath);
	text = text.trim().replace(/^\/\//, '');

	test.ok(
		$grunt.file.isDir($path.resolve('./test/dist/html')),
		'we have folder "trunk/html" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/dist/css')),
		'we have folder "trunk/css" .'
	);
	test.ok(
		$grunt.file.isDir($path.resolve('./test/dist/js')),
		'we have folder "trunk/js" .'
	);
	test.ok(
		$grunt.file.isFile(onlineJsPath),
		'commit "dev/trunk/" to "online/trunk/" .'
	);
	test.ok(
		$grunt.file.isFile(distJsPath),
		'update "repo://online/trunk" to "./test/dist/" .'
	);
	test.equal(
		$grunt.file.read(distJsPath),
		$grunt.file.read(trunkJsPath),
		'dist file is same as trunk file. '
	);

	$grunt.util.spawn({
		cmd: 'svn',
		args: ['log', repository + 'online/trunk', '-l', 1, '--xml']
	}, function(err, result, code){
		test.ok(
			result.stdout.indexOf(text) >= 0,
			'make sure "online/trunk" have correct log. '
		);

		test.done();
	});

};


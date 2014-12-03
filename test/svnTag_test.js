'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnTag = function(test){
	test.expect(7);

	var trunkJsPath = $path.resolve('./test/trunk/js/test.js');
	var repository = $grunt.config.get('svnConfig.repository');

	var text = $grunt.file.read(trunkJsPath);
	text = text.trim().replace(/^\/\//, '');

	$grunt.util.spawn({
		cmd: 'svn',
		args: ['list', repository + 'dev/tags']
	}, function(err, result, code){
		var rs = result.stdout.trim().split(/\n/)[0];
		var tag = rs.trim().replace(/[\/\\]/g, '');

		test.ok(
			$grunt.file.isDir($path.resolve('./test/tools/temp/devtags/' + tag)),
			'we have folder "dev/tags/' + tag + '" .'
		);

		test.ok(
			$grunt.file.isDir($path.resolve('./test/tools/temp/onlinetags/' + tag)),
			'we have folder "online/tags/' + tag + '" .'
		);

		var devTagFile = $path.resolve('./test/tools/temp/devtags/' + tag + '/js/test.js');
		var onlineTagFile = $path.resolve('./test/tools/temp/onlinetags/' + tag + '/js/test.js');

		test.ok(
			$grunt.file.isFile(devTagFile),
			'"dev/tags/" get correct file .'
		);

		test.ok(
			$grunt.file.isFile(onlineTagFile),
			'"online/tags/" get correct file .'
		);

		test.equal(
			$grunt.file.read(devTagFile),
			$grunt.file.read(trunkJsPath),
			'"dev/tags" file is same as trunk file. '
		);

		test.equal(
			$grunt.file.read(onlineTagFile),
			$grunt.file.read(trunkJsPath),
			'"online/tags" file is same as trunk file. '
		);

		$grunt.util.spawn({
			cmd: 'svn',
			args: ['log', repository + 'online/tags/' + tag, '-l', 1, '--xml']
		}, function(err, result, code){
			test.ok(
				result.stdout.indexOf(text) >= 0,
				'"online/tags/" get correct log .'
			);

			test.done();
		});

	});

};


'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnInit = function(test){
	test.expect(1);

	var svnPath = 'https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/test/svninit/inner';

	$grunt.util.spawn({
		cmd: 'svn',
		args: ['info', svnPath]
	}, function(error, result, code){

		var json = result.stdout.split(/\n/g).reduce(function(obj, str){
			var index = str.indexOf(':');
			var key = str.substr(0, index).trim().toLowerCase();
			var value = str.substr(index + 1).trim();
			obj[key] = value;
			return obj;
		}, {});

		test.equal(
			json.url,
			svnPath,
			'Should created svn folder : ' + svnPath + '.'
		);

		test.done();
	});
};


'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnCheckout = function(test){
	test.expect(1);

	console.log('testResult', $grunt.config.get('testResult'));

	test.ok(
		$grunt.config.get('testResult'),
		'Task svn-test-spawn execute failure.'
	);

	test.done();
};


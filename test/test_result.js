'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnCheckout = function(test){
	test.expect(1);

	var testOutputFile = $path.resolve('./test/test/result.js');

	test.equal(
		$grunt.file.read(testOutputFile),
		'assertions passed',
		'Test output should is "assertions passed". '
	);

	test.done();
};


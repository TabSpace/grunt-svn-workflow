'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnConfig = function(test){
	test.expect(2);

	test.equal(
		$grunt.config.get('svnConfig.project'),
		'https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/',
		'Should auto get the working directory repository.'
	);

	test.equal(
		$grunt.config.get('svnConfig.test'),
		'https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/test/',
		'Should auto get the working directory repository.'
	);

	test.done();
};

'use strict';

var $grunt = require('grunt');
var $path = require('path');

exports.svnConfig = function(test){
	test.expect(1);
	test.equal(
		$grunt.config.get('svnConfig.repository'),
		'https://svn.sinaapp.com/liangdong/1/test/svn-workflow/',
		'Should auto get the working directory repository.'
	);
	test.done();
};

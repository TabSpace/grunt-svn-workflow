/*
 * grunt-svn-workflow
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 "Sina" Tony Liang
 * Licensed under the MIT license.
 */
var $path = require('path');

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		svnConfig : {
			// Project svn repository path.
			repository : 'auto',
			// Project deploy path.
			projectDir : $path.resolve(__dirname, '../'),
			// Project gruntfile directory.
			taskDir : 'tools'
		},
		svnInit : {
			map : {
				'dev' : {
					'branches' : 'folder',
					'tags' : 'folder',
					'trunk' : {
						'html' : 'folder',
						'css' : 'folder',
						'js' : 'folder'
					}
				},
				'online' : {
					'tags' : 'folder',
					'trunk' : 'folder'
				}
			}
		}
	});

	// Whenever the "deploy" task is run, checkout the workingcopy.
	grunt.registerTask('deploy', [

	]);

	// By default, deploy the workingcopy.
	grunt.registerTask('default', [
		'deploy'
	]);

};



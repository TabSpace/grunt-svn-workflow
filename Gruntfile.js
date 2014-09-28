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
		confirm : {
			distribute : {
				msg : 'publish ?'
			}
		},
		svnConfig : {
			// Project svn repository path.
			repository : 'auto',
			// Gruntfile.js path relative to Project svn repository path.
			relativePath : 'tools',
			// Project local path.
			projectDir : $path.resolve(__dirname, 'test')
		},
		svnInit : {
			map : {
				'dev' : {
					'branches' : true,
					'tags' : true,
					'trunk' : {
						'html' : true,
						'css' : true,
						'js' : true
					}
				},
				'online' : {
					'tags' : true,
					'trunk' : true
				}
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', [

	]);

	// By default, lint and run all tests.
	grunt.registerTask('default', [
		'test'
	]);

};



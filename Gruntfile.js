/*
 * grunt-svn-workflow
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tony Liang [pillar0514@gmail.com]
 * Licensed under the MIT license.
 */
var $path = require('path');

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/**/*.js',
				'<%= nodeunit.svnConfig %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		confirm : {
			distribute : {
				msg : 'publish ?'
			}
		},
		svnConfig : {
			// Project svn repository path.
			repository : 'auto',
			// Project deploy path.
			projectDir : $path.resolve(__dirname, 'test'),
			// Project gruntfile directory.
			taskDir : 'tools'
		},
		svnInit : {
			options : {
				repository: '<%=svnConfig.repository%>',
				cwd: '<%=svnConfig.projectDir%>'
			},
			// Build pathes according to the map.
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
		},
		svnCheckout : {
			options : {
				repository: '<%=svnConfig.repository%>',
				cwd: '<%=svnConfig.projectDir%>'
			},
			deploy : {
				map : {
					'trunk' : 'dev/trunk',
					'tools/temp/devtags' : 'dev/tags',
					'dist' : 'online/trunk',
					'tools/temp/onlinetags' : 'online/tags'
				}
			},
			prepare : {
				map : {
					'tools/temp/online':'online/trunk',
					'tools/temp/trunk' : 'dev/trunk'
				}
			}
		},
		svnCommit : {
			options : {
				repository: '<%=svnConfig.repository%>',
				cwd: '<%=svnConfig.projectDir%>'
			},
			online : {
				logResource : 'dev/trunk',
				svn : 'online/trunk',
				src : 'tools/temp/online'
			}
		},
		svnTag : {
			options : {
				repository: '<%=svnConfig.repository%>',
				cwd: '<%=svnConfig.projectDir%>'
			},
			common : {
				dev : 'tools/temp/trunk',
				devSvn : 'dev/trunk',
				devTag : 'dev/tags',
				online : 'tools/temp/online',
				onlineSvn : 'online/trunk',
				onlineTag : 'online/tags'
			}
		},
		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: [
				'test/trunk',
				'test/dist',
				'test/tools/temp'
			]
		},
		// Copy file for unit tests.
		copy: {
			test: {
				expand : true,
				cwd : 'test/tools/temp/trunk/',
				src : '**/*',
				dest : 'test/tools/temp/online/'
			}
		},
		nodeunit: {
			svnConfig: ['test/svnConfig_test.js'],
			svnInit : ['test/svnInit_test.js'],
			svnCheckout : ['test/svnCheckout_test.js'],
			svnCommit : ['test/svnCommit_test.js'],
			svnTag : ['test/svnTag_test.js']
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// Load test tasks.
	grunt.loadTasks('test/tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask(
		'deploy',
		'Checkout the workingcopy according to the folder map.',
		[
			'svnConfig',
			'svnCheckout:deploy'
		]
	);

	grunt.registerTask(
		'publish',
		'Pack and compress files, then distribute.',
		[
			'svnConfig',
			'svnCheckout:prepare',
			'confirm:distribute',
			'svnCommit:online',
			'svnTag',
			'deploy'
		]
	);

	// Whenever the "test" task is run, first clean directories for test, then run this
	// plugin's task(s), test the result step by step.
	grunt.registerTask('svn-test', [
		'jshint',

		'svnConfig',
		'nodeunit:svnConfig',
		'cleanSvn',
		'clean',

		'svnInit',
		'svnCheckout:deploy',
		'nodeunit:svnInit',

		'commitFile',
		'svnCheckout:prepare',
		'nodeunit:svnCheckout',

		'copy:test',
		'svnCommit:online',
		'svnCheckout:deploy',
		'nodeunit:svnCommit',

		'svnTag',
		'svnCheckout:deploy',
		'nodeunit:svnTag'
	]);

	// Whenever the "test" task is run, first clean directories for test, then run this
	// plugin's task(s), test the result step by step.
	grunt.registerTask('test', [
		'jshint',
		'nodeunit:svnInit',
		'nodeunit:svnCheckout'
	]);

	// By default, lint and run all tests.
	grunt.registerTask('default', [
		'test'
	]);

};



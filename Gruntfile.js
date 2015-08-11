/*
 * grunt-svn-workflow
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tony Liang [pillar0514@gmail.com]
 * Licensed under the MIT license.
 */
var $path = require('path');

module.exports = function(grunt) {

	var timeStamp = Date.now();

	// Project configuration.
	grunt.initConfig({
		projectDir : $path.resolve(__dirname, 'test'),
		timeStamp : timeStamp,
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
			project : 'https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/',
			// Get svn repository path from local path.
			test : {
				// Local svn folder path.
				from : $path.resolve(__dirname, 'test/test/base'),
				// Relative path from local svn folder repository url to online target svn repository url.
				to : '../'
			}
		},
		svnInit : {
			options : {
				cwd: '<%=projectDir%>/test',
				repository: '<%=svnConfig.test%>'
			},
			test : {
				repository: '<%=svnConfig.project%>/test',
				// Build pathes according to the map.
				map : {
					'svninit' : {
						'inner' : 'folder'
					}
				}
			}
		},
		svnCheckout : {
			options : {
				cwd: '<%=projectDir%>',
				repository: '<%=svnConfig.project%>'
			},
			test : {
				repository : '<%=svnConfig.test%>',
				map : {
					'/test/checkout' : 'checkout'
				}
			}
		},
		svnCommit : {
			options : {
				repository: '<%=svnConfig.repository%>',
				cwd: '<%=svnConfig.projectDir%>'
			},
			test_normal : {
				svn : 'dev/trunk',
				src : 'trunk'
			},
			test_log_from_fn : {
				log : function(){
					return timeStamp + 'html';
				},
				svn : 'dev/trunk',
				src : 'trunk'
			},
			test_log_from_tpl : {
				log : '<%=timeStamp%>js',
				svn : 'dev/trunk',
				src : 'trunk'
			},
			test_log_from_svn : {
				log : '{dev/trunk}',
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
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask('svn-test-svnConfig', [
		'svnConfig',
		'nodeunit:svnConfig'
	]);

	grunt.registerTask('svn-test-svnCheckout', [
		'svnConfig',
		'svnCheckout:test',
		'nodeunit:svnCheckout'
	]);

	grunt.registerTask('svn-test-svnInit', [
		'svnConfig',
		'svnInit:test',
		// 'nodeunit:svnInit'
	]);

	// grunt.registerTask('svn-test-svnConfig', [
	// 	'svnConfig',
	// 	'nodeunit:svnConfig'
	// ]);

	// Whenever the "test" task is run, first clean directories for test, then run this
	// plugin's task(s), test the result step by step.
	grunt.registerTask('svn-test', [
		'jshint',
		'svn-test-svnConfig',
		'svn-test-svnInit',
		'svn-test-svnCheckout'

		// 'svnConfig',
		// 'nodeunit:svnConfig',
		// 'cleanSvn',
		// 'clean',

		// 'svnInit',
		// 'svnCheckout:deploy',
		// 'nodeunit:svnInit',

		// 'makeCSS',
		// 'svnCommit:css',

		// 'makeHTML',
		// 'svnCommit:html',

		// 'makeJS',
		// 'svnCommit:js',

		// 'svnCheckout:prepare',
		// 'nodeunit:svnCheckout',

		// 'copy:test',
		// 'svnCommit:online',
		// 'svnCheckout:deploy',
		// 'nodeunit:svnCommit',

		// 'svnTag',
		// 'svnCheckout:deploy',
		// 'nodeunit:svnTag'
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



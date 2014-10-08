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
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/**/*.js'
			//	'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		svnConfig : {
			// Project svn repository path.
			repository : 'auto',
			// Project deploy path.
			projectDir : $path.resolve(__dirname, 'demo'),
			// Project gruntfile directory.
			taskDir : 'tools'
		},
		svnInit : {
			options : {
				repository: '<%=svnConfig.repository%>',
				cwd: '<%=svnConfig.projectDir%>'
			},
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
					'trunk/' : '/dev/trunk/',
					'dist/' : '/online/trunk/',
					'pack/' : '/dev/pack/'
				}
			},
			packPrepare : {
				map : {
					'tools/temp/online/':'/online/trunk/',
					'tools/temp/trunk/' : '/dev/trunk/',
					'tools/temp/pack/' : '/dev/pack/'
				}
			}
		},
		svnCommit : {
			options : {
				repository: '<%=svnConfig.repository%>',
				cwd: '<%=svnConfig.projectDir%>'
			},
			online : {
				logResource : '/dev/trunk/',
				svn : '/online/trunk/',
				src : 'tools/temp/online/'
			}
		},
		svnTag : {
			options : {
				repository: '<%=svnConfig.repository%>',
				cwd: '<%=svnConfig.projectDir%>'
			},
			common : {
				dev : 'tools/temp/trunk/',
				devSvn : '/dev/trunk/',
				devTag : '/dev/tags/',
				online : 'tools/temp/online/',
				onlineSvn : '/online/trunk/',
				onlineTag : '/online/tags/'
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
		'jshint'
	]);

	// Whenever the "deploy" task is run, checkout the workingcopy.
	grunt.registerTask('deploy', [

	]);

	// By default, lint and run all tests.
	grunt.registerTask('default', [
		'test'
	]);

};



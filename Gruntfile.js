/*
 * grunt-svn-workflow
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tony Liang [pillar0514@gmail.com]
 * Licensed under the MIT license.
 */
var $path = require('path');

module.exports = function(grunt) {

	//test account:
	//id : svn_workflow@sina.cn
	//password : test123

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
				cwd: '<%=projectDir%>',
				repository: '<%=svnConfig.test%>'
			},
			test_normal : {
				log : '<%=timeStamp%>_normal',
				svn : 'commit/normal',
				src : 'test/commit/normal'
			},
			test_log_from_fn : {
				log : function(){
					return timeStamp + '_fn';
				},
				svn : 'commit/fn',
				src : 'test/commit/fn'
			},
			test_log_from_svn : {
				log : '{dev/trunk}',
				svn : 'commit/svn',
				src : 'test/commit/svn'
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

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	//unit test for svnConfig
	grunt.registerTask('svn-test-svnConfig', [
		'svnConfig',
		'nodeunit:svnConfig'
	]);

	//unit test for svnCheckout
	grunt.registerTask(
		'svn-test-svnCheckout-prepare', 
		'svn-test-svnCheckout-prepare',
		function(){
			var folderPath = $path.resolve('./test/test/checkout/');
			grunt.file.delete(folderPath);
		}
	);

	grunt.registerTask('svn-test-svnCheckout', [
		'svnConfig',
		'svn-test-svnCheckout-prepare',
		'svnCheckout:test',
		'nodeunit:svnCheckout'
	]);

	//unit test for svnInit
	grunt.registerTask(
		'svn-test-svnInit-prepare', 
		'svn-test-svnInit-prepare',
		function(){
			var done = this.async();
			var path = 'test/svninit';
			var svnPath = grunt.config.get('svnConfig.project') + 'test/svninit';
			grunt.log.writeln('svn delete ' + svnPath + ' -m "delete ' + path + '"');
			grunt.util.spawn({
				cmd: 'svn',
				args: ['delete', svnPath, '-m', '"delete ' + path + '"'],
				opts : {
					stdio : 'inherit'
				}
			}, function(err, result, code){
				grunt.log.ok('The svn path: "' + svnPath + '" has been deleted!');
				done();
			});
		}
	);

	grunt.registerTask('svn-test-svnInit', [
		'svnConfig',
		'svn-test-svnInit-prepare',
		'svnInit:test',
		'nodeunit:svnInit'
	]);

	//unit test for svnCommit
	grunt.registerTask(
		'svn-test-svnCommit-prepare', 
		'svn-test-svnCommit-prepare',
		function(){
			var done = this.async();
			done();
		}
	);

	grunt.registerTask('svn-test-svnCommit', [
		'svnConfig',
		'svn-test-svnCommit-prepare',
		'svnCommit',
	]);

	// Whenever the "test" task is run, first clean directories for test, then run this
	// plugin's task(s), test the result step by step.
	grunt.registerTask('test', [
		'jshint',
		'svn-test-svnConfig',
		'svn-test-svnInit',
		'svn-test-svnCheckout',
		'svn-test-svnCommit'
	]);

	// By default, lint and run all tests.
	grunt.registerTask('default', [
		'test'
	]);

};



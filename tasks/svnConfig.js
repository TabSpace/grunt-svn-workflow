var $path = require('path');
var $Client = require('svn-spawn');

/*
 * grunt-svn-workflow
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tony Liang [pillar0514@gmail.com]
 * Licensed under the MIT license.
 *
 * @fileoverview Get the svn informations for subsequent work.
 */

module.exports = function(grunt){
	grunt.registerTask(
		'svnConfig',
		'Get or set svn repository info',
		function(){
			var done = this.async();

			var conf = grunt.config.get('svnConfig');

			if(!conf.projectDir){
				grunt.fatal('Task svnConfig need option: projectDir.');
			}
			
			if(!conf.taskDir){
				grunt.fatal('Task svnConfig need option: taskDir.');
			}

			var taskDir = $path.resolve(conf.projectDir, conf.taskDir);
			grunt.log.writeln('Project task directory is ', taskDir);

			if(!conf.repository || conf.repository === 'auto'){
				var client = new $Client({
					cwd : taskDir
				});

				//Auto get the svn repository url.
				client.getInfo(function(err, data) {
					var svnBasePath = '';
					if(err){
						grunt.log.errorlns(err);
						grunt.fatal('Get svn info failure');
					}else{
						if(data.url){
							svnBasePath = data.url.replace(conf.taskDir, '');
							grunt.config.set('svnConfig.repository', svnBasePath);
							grunt.log.ok('Project repository url is %s', svnBasePath);
							done();
						}else{
							grunt.fatal('Get svn repository url failure');
						}
					}
				});
			}else{
				done();
			}
		}
	);
};



var $path = require('path');
var $cmdSeries = require('../utils/cmdSeries');

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
				$cmdSeries(grunt, [
					{
						cmd : 'svn',
						args : ['info', taskDir]
					}
				], {
					done : function(error, result, code){
						var svnBasePath = '';
						if(error){
							grunt.log.errorlns(error);
							grunt.fatal('Get svn info failure');
						}else{
							var data = result.stdout.split(/\n/g).reduce(function(obj, str){
								var index = str.indexOf(':');
								var key = str.substr(0, index).trim();
								var value = str.substr(index + 1).trim();
								obj[key] = value;
								return obj;
							}, {});

							if(data.URL){
								svnBasePath = data.URL.replace(conf.taskDir, '');
								grunt.config.set('svnConfig.repository', svnBasePath);
								grunt.log.writeln('Project repository url is' + svnBasePath);
								grunt.log.write('Get svn info. ').ok();
								done();
							}else{
								grunt.fatal('Get svn repository url failure.');
							}
						}
						done();
					}
				});
			}else{
				done();
			}
		}
	);
};



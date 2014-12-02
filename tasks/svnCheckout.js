var $fs = require('fs');
var $path = require('path');
var $Client = require('svn-spawn');

/*
 * grunt-svn-workflow
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tony Liang [pillar0514@gmail.com]
 * Licensed under the MIT license.
 *
 * @fileoverview Check out target files.
 */

module.exports = function(grunt){

	var $async = grunt.util.async;

	grunt.registerMultiTask(
		'svnCheckout',
		'Checkout files to target directory.',
		function(arg){
			var done = this.async();
			var conf = this.options();
			var data = this.data;
			var map = data.map;
			var queue = [];

			Object.keys(map).forEach(function(localPath){
				var svnPath = map[localPath];
				var srcPath = $path.join(conf.cwd, localPath);

				// $path.join will replace 'http://path' 'to http:/path'.
				if(svnPath){
					svnPath = conf.repository + svnPath;
				}else{
					svnPath = conf.repository + '/dev/branches/' + arg;
				}
				
				queue.push(function(callback){
					var client = new $Client({
						cwd : srcPath
					});
					
					if (!$fs.existsSync(srcPath)){
						//Check out files if we don't have the workingcopy.
						grunt.file.mkdir(srcPath);
						grunt.log.writeln('start checkout : %s to %s', svnPath, srcPath);
						client.checkout(svnPath, function(err) {
							if (err){
								grunt.log.errorlns(err);
								grunt.fatal('checkout : ' + svnPath + ' error!');
							}else{
								grunt.log.writeln('checkout : %s complete!', svnPath);
							}
							grunt.log.writeln();
							callback();
						});
					}else{
						//Update the workingcopy if we already have checked out.
						grunt.log.writeln('start update : %s to %s', svnPath, srcPath);
						client.update(function(err) {
							if (err){
								grunt.log.errorlns(err);
								grunt.fatal('update : ' + svnPath + ' error!');
							}else{
								grunt.log.writeln('update : %s complete!', svnPath);
							}
							grunt.log.writeln();
							callback();
						});
					}
				});
			});

			$async.series(queue, function(){
				grunt.log.ok('all directories were checkouted!');
				done();
			});
		}
	);
};



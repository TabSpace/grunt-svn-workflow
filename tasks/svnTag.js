var $fs = require('fs');
var $path = require('path');
var $Client = require('svn-spawn');
var $Spawn = require('easy-spawn');

/*
 * grunt-svn-workflow
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tony Liang
 * Licensed under the MIT license.
 *
 * @fileoverview Create a tag for the project.
 */

module.exports = function(grunt){

	//Resolve the web url joins.
	var joinUrl = function(){
		var args = Array.prototype.slice.call(arguments);
		return args.shift().replace(/\/$/, '') + '/' + args.map(function(s){
			return ('' + s).trim().replace(/^\/+|\/+$/gi, '');
		}).join('/');
	};

	grunt.registerMultiTask(
		'svnTag',
		'generate svn tags',
		function(){
			var done = this.async();
			var conf = this.options();
			var data = this.data;

			var devPath = $path.join(conf.cwd, data.dev);
			var devSvnPath = joinUrl(conf.repository, data.devSvn);
			var devTagPath = joinUrl(conf.repository, data.devTag);
			var onlinePath = $path.join(conf.cwd, data.online);
			var onlineSvnPath = joinUrl(conf.repository, data.onlineSvn);
			var onlineTagPath = joinUrl(conf.repository, data.onlineTag);

			grunt.log.writeln('devPath:',devPath);
			grunt.log.writeln('devSvnPath:',devSvnPath);
			grunt.log.writeln('devTagPath:',devTagPath);
			grunt.log.writeln('onlinePath:',onlinePath);
			grunt.log.writeln('onlineSvnPath:',onlineSvnPath);
			grunt.log.writeln('onlineTagPath:',onlineTagPath);

			var spawnLog = new $Spawn({
				cwd: onlinePath
			});
			var spawnDev = new $Spawn({
				cwd: devPath
			});
			var spawnOnline = new $Spawn({
				cwd: onlinePath
			});

			var targetVersion = '';
			var signs = {};
			var checkComplete = function(sign) {
				//Finish the tag create job, when online tag and dev tag are both created.
				signs[sign] = true;
				if(signs.online && signs.dev){
					grunt.log.writeln('commit tag complete!');
					grunt.log.writeln();
					grunt.log.ok('tag %s build complete!', targetVersion);
					done();
				}
			};

			spawnLog.cmd(['svn', 'log', onlineSvnPath, '-l', '1', '--xml'], function(err, data) {
				//We can get the version number and logs from the online svn folder.
				if(err){
					grunt.log.errorlns(err);
					grunt.fatal('svn log error!');
				}else{
					var v = '';
					var log = '';
					var vRegResult = (/revision="(\d+)"/).exec(data);
					var logRegResult = (/<msg>([\w\W]*?)<\/msg>/).exec(data);

					//Get the version number.
					if(vRegResult && vRegResult[1]){
						v = vRegResult[1];
					}

					//Get the log string.
					if(logRegResult && logRegResult[1]){
						log = logRegResult[1];
					}

					//All ready , start to building the tag.
					if(v){
						grunt.log.writeln('start build tag: %s ...', v);
					}else{
						grunt.fatal('can not get the version number');
					}

					//Prepare and join the tag logs.
					if(log){
						log = ['[revision:' + v + ']', log].join(';\n').replace(/\r\n/g, '\n');
						grunt.log.writeln('tag log: %s ...', log);
					}else{
						log = '[revision:' + v + ']';
					}
					targetVersion = v;

					var spawnCheck = new $Spawn({
						cwd: devPath
					});

					spawnCheck.cmd(['svn', 'list', joinUrl(onlineTagPath, v)], function(err, data) {
						//Get the folder status from the command : svn list.
						if(err){
							if((/non-existent/gi).test(err)){
								grunt.log.ok('%s : tag not exists. start tag building ...', v);
								//Copy dev/trunk to dev/tags
								spawnDev.cmd(['svn', 'cp', devSvnPath, joinUrl(devTagPath, v), '-m', log], function(err, data) {
									if(err){
										grunt.log.errorlns(err);
										grunt.fatal('build dev tag : ' + joinUrl(devTagPath, v) + ' error!');
									}else{
										grunt.log.writeln('build tag %s complete!', joinUrl(devTagPath, v));
										checkComplete('dev');
									}
								});

								//Copy online/trunk to online/tags
								spawnOnline.cmd(['svn', 'cp', onlineSvnPath, joinUrl(onlineTagPath, v), '-m', log], function(err, data) {
									if(err){
										grunt.log.errorlns(err);
										grunt.fatal('build online tag : ' + joinUrl(onlineTagPath, v) + ' error!');
									}else{
										grunt.log.writeln('build tag %s complete!', joinUrl(onlineTagPath, v));
										checkComplete('online');
									}
								});
							}else{
								grunt.log.errorlns(err);
								grunt.fatal('svn list error!');
							}
						}else{
							grunt.fatal(v +' tag exists ! cancel tag building!');
						}
					});
				}
			});
		}
	);
};

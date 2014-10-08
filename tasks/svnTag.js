var $fs = require('fs');
var $path = require('path');
var $Client = require('svn-spawn');
var $Spawn = require('easy-spawn');

module.exports = function(grunt){

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
				signs[sign] = true;
				if(signs.online && signs.dev){
					grunt.log.writeln('commit tag complete!');
					grunt.log.writeln();
					grunt.log.ok('tag %s build complete!', targetVersion);
					done();
				}
			};

			spawnLog.cmd(['svn', 'log', onlineSvnPath, '-l', '1', '--xml'], function(err, data) {
				if(err){
					grunt.log.errorlns(err);
					grunt.fatal('svn log error!');
				}else{
					var v = '';
					var log = '';
					var vRegResult = (/revision="(\d+)"/).exec(data);
					var logRegResult = (/<msg>([\w\W]*?)<\/msg>/).exec(data);
					if(vRegResult && vRegResult[1]){
						v = vRegResult[1];
					}
					if(logRegResult && logRegResult[1]){
						log = logRegResult[1];
					}
					if(v){
						grunt.log.writeln('start build tag: %s ...', v);
					}else{
						grunt.fatal('can not get the version number');
					}
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
						if(err){
							if((/non-existent/gi).test(err)){
								grunt.log.ok('%s : tag not exists. start tag building ...', v);
								//复制 dev/trunk 到 dev/tags
								spawnDev.cmd(['svn', 'cp', devSvnPath, joinUrl(devTagPath, v), '-m', log], function(err, data) {
									if(err){
										grunt.log.errorlns(err);
										grunt.fatal('build dev tag : ' + joinUrl(devTagPath, v) + ' error!');
									}else{
										grunt.log.writeln('build tag %s complete!', joinUrl(devTagPath, v));
										checkComplete('dev');
									}
								});

								//复制 online/trunk 到 online/tags
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

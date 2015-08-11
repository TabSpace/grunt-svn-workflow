var $fs = require('fs');
var $path = require('path');
var $readline = require('readline');
var $tools = require('../utils/tools');
var $cmdSeries = require('../utils/cmdSeries');
var $askFor = require('ask-for');

module.exports = function(grunt){

	grunt.registerMultiTask(
		'svnCommit',
		'Commit files',
		function(arg){

			var done = this.async();
			var conf = this.options();
			var data = this.data;
			var target = this.target;

			var options = Object.keys(conf).reduce(function(obj, key){
				obj[key] = data[key] || conf[key] || '';
				return obj;
			}, {});

			this.requires(['svnConfig']);

			var srcPath = $tools.join(options.cwd, data.src);
			var svnPath = $tools.join(options.repository, data.svn);

			var strLog = '';

			var getLogMode = '';
			var reg = (/^\{([^\{\}]+)\}$/);
			if($tools.type(data.log) === 'function'){
				strLog = data.log();
			}else if($tools.type(data.log) === 'string'){
				if(data.log === '{ask}'){
					getLogMode = 'ask';
				}else if(reg.test(data.log)){
					getLogMode = 'svn';
				}else{
					strLog = data.log;
				}
			}else{
				strLog = 'Auto commit by task svnCommit:' + target;
			}

			if(getLogMode === 'ask'){
				var question = 'Input the log message for task svnCommit:' + target + '\n';
				
				$askFor([question], function(spec) {
					strLog = spec[question];
					console.log('strLog:', strLog);
					done();
				});


				// process.stdin.write('my log\n');
				// process.stdin.read('my log');
				// process.stdin.resume();

				
				// process.stdin.pause();
				// process.stdin.resume();
				// process.stdout.write('end\n');



			}else if(getLogMode === 'svn'){
				var regResult = reg.exec(data.log);
				var targetSvnPath = regResult ? regResult[1] || '' : '' ;
				targetSvnPath = $tools.join(options.repository, targetSvnPath);

				console.log('strLog:', targetSvnPath);
				done();
			}else{
				console.log('strLog:', strLog);
				done();
			}

			// var srcPath = $path.join(conf.cwd, data.src);
			// var svnPath = joinUrl(conf.repository, data.svn);
			// var logResourcePath = '';
			// var logStr = '';

			// if(data.logResource){
			// 	if(!arg){
			// 		logResourcePath = joinUrl(conf.repository, data.logResource);
			// 	}else{
			// 		logResourcePath = joinUrl(conf.repository, data.logResource, 'branches', arg);
			// 	}
			// }else{
			// 	if(typeof(data.log) === 'function'){
			// 		logStr = data.log();
			// 	}else if(typeof(data.log) === 'string'){
			// 		logStr = data.log;
			// 	}else{
			// 		logStr = 'auto commit ' + (new Date()).toLocaleString();
			// 	}
			// }

			// grunt.log.writeln('svn commit ', srcPath);
			// if(data.logResource){
			// 	grunt.log.writeln('copy log from ', logResourcePath);
			// }else{
			// 	grunt.log.writeln('commit log: ', logStr);
			// }
			// grunt.log.writeln();

			// var info = {};
			// var jobs = [];

			// //We can get all logs from previous commit to now if we specify the log source.
			// //To do this , we get the previous commit revision number at first.
			// var getPrevRevision = function(callback){
			// 	grunt.log.writeln();
			// 	grunt.log.writeln('get prev revision ...');
			// 	var spawnLog = new $Spawn({
			// 		cwd: srcPath
			// 	});
			// 	grunt.log.writeln('svn log ' + svnPath + ' -l 1 --xml');
			// 	spawnLog.cmd(['svn', 'log', svnPath, '-l', '1', '--xml'], function(err, data){
			// 		if(err){
			// 			grunt.log.errorlns(err);
			// 			grunt.fatal('get prev version number error!');
			// 		}else{
			// 			var v = '';
			// 			var log = '';
			// 			var vRegResult = (/revision="(\d+)"/).exec(data);
			// 			var logRegResult = (/<msg>([\w\W]*?)<\/msg>/).exec(data);
			// 			if(vRegResult && vRegResult[1]){
			// 				v = vRegResult[1];
			// 			}
			// 			if(logRegResult && logRegResult[1]){
			// 				log = logRegResult[1];
			// 			}
			// 			if(v){
			// 				grunt.log.writeln('prev revision is ' + v);
			// 				info.prevVersion = v;
			// 				info.prevLog = log;
			// 				callback();
			// 			}else{
			// 				grunt.fatal('can not get prev version number');
			// 			}
			// 		}
			// 	});
			// };

			// //Get all logs from previous commit to now.
			// var getLogs = function(callback){
			// 	var prevVersion = info.prevVersion || '';
			// 	var prevLog = info.prevLog || '';
			// 	var log = '';
			// 	var logs = [];
			// 	grunt.log.writeln();
			// 	grunt.log.writeln('get logs before ', prevVersion);

			// 	if(!prevVersion){
			// 		info.commitLog = prevLog;
			// 		callback();
			// 		return;
			// 	}

			// 	var spawnLog = new $Spawn({
			// 		cwd: srcPath
			// 	});
				
			// 	grunt.log.writeln('svn log ' + logResourcePath + ' -r ' + prevVersion + ' :HEAD --xml');
			// 	spawnLog.cmd(['svn', 'log', logResourcePath, '-r', prevVersion + ':HEAD', '--xml'], function(err, data){
			// 		if(err){
			// 			grunt.log.errorlns(err);
			// 			grunt.fatal('get dev/trunk svn log error!');
			// 		}else{
			// 			var prevVRegResult = (/\[revision\:(\d+)\]/).exec(prevLog);
			// 			var logReg = (/<msg>([\w\W]*?)<\/msg>/g);
			// 			var logRegResult = logReg.exec(data);
			// 			while(logRegResult && logRegResult[1]){
			// 				logs.push(logRegResult[1]);
			// 				logRegResult = logReg.exec(data);
			// 			}
			// 			if(logs.length){
			// 				log = logs.join('; \n');
			// 			}

			// 			if(log){
			// 				log = log.replace(/\r\n/g, '\n');
			// 			}else{
			// 				log = 'auto commit';
			// 			}

			// 			grunt.log.writeln('commit log is \n' + log);
			// 			grunt.log.writeln();
			// 			info.commitLog = log;
			// 			callback();
			// 		}
			// 	});
			// };

			// //Finally, commit files.
			// var doCommit = function(callback){
			// 	var client = new $Client({
			// 		cwd : srcPath
			// 	});
			// 	var commitLog = info.commitLog || logStr;
			// 	grunt.log.writeln('svn add ' + srcPath);
			// 	client.addLocal(function(err) {
			// 		if(err){
			// 			grunt.log.errorlns(err);
			// 			grunt.fatal('svn add ' + srcPath + ' error!');
			// 		}else{
			// 			grunt.log.writeln('svn commit ' + srcPath);
			// 			client.commit(commitLog, function(err) {
			// 				if (err){
			// 					grunt.log.errorlns(err);
			// 					grunt.fatal('svn commit ' + srcPath + ' error!');
			// 				}else{
			// 					callback();
			// 				}
			// 			});
			// 		}
			// 	});
			// };

			// if(data.logResource){
			// 	jobs.push(getPrevRevision);
			// 	jobs.push(getLogs);
			// }
			// jobs.push(doCommit);

			// $async.series(jobs, function(){
			// 	grunt.log.ok('commit : %s complete!', srcPath);
			// 	done();
			// });

		}
	);
};

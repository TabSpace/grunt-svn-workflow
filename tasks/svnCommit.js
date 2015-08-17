var $tools = require('../utils/tools');
var $cmdSeries = require('../utils/cmdSeries');
var $askFor = require('ask-for');

module.exports = function(grunt){

	var $async = grunt.util.async;

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

			var regHttpPrev = (/^http\w*\:\/\//);

			var srcPath = $tools.join(options.cwd, data.src);
			var svnPath = regHttpPrev.test(data.svn) ? data.svn : $tools.join(options.repository, data.svn);

			var title = 'task svnCommit' + (target ? ':' + target : '');
			var strLog = '';

			var getLogMode = '';
			var regBracket = (/^\[([^\[\]]+)\]$/);
			var regBrace = (/\{([^\{\}]+)\}/);
			if($tools.type(data.log) === 'function'){
				strLog = data.log();
			}else if($tools.type(data.log) === 'string'){
				if(regBrace.test(data.log)){
					getLogMode = 'ask';
				}else if(regBracket.test(data.log)){
					getLogMode = 'svn';
				}else{
					strLog = data.log;
				}
			}else{
				strLog = 'Auto commit by task svnCommit:' + target;
			}

			var jobs = [];

			if(getLogMode === 'ask'){
				jobs.push(function(callback){
					var question = data.question || 'Input the log message for task svnCommit:' + target + '\n';
					$askFor([question], function(spec) {
						strLog = $tools.substitute(data.log, {
							ask : spec[question]
						});
						callback();
					});
				});
			}else if(getLogMode === 'svn'){
				jobs.push(function(callback){
					var regResult = regBracket.exec(data.log);
					var logSvnPath = regResult ? regResult[1] || '' : '' ;
					if(!regHttpPrev.test(logSvnPath)){
						logSvnPath = $tools.join(options.repository, logSvnPath);
					}
					grunt.log.writeln('Get logs from', logSvnPath);

					var info = {};
					var commands = [];

					commands.push({
						cmd : 'svn',
						args : ['log', svnPath, '-l', '1', '--xml'],
						opts : {
							cwd : srcPath
						}
					});

					//Get last revision
					commands.push(function(error, result, code){
						if(error){
							grunt.log.errorlns(error).error();
							grunt.fatal([title, 'get prev version number error!'].join(' '));
						}else{
							var prevVersion = '';
							var vRegResult = (/revision="(\d+)"/).exec(result.stdout);
							if(vRegResult && vRegResult[1]){
								prevVersion = vRegResult[1];
							}
							if(prevVersion){
								grunt.log.writeln('Prev revision is ' + prevVersion);
							}else{
								grunt.fatal('Can not get prev version number');
							}

							return {
								cmd : 'svn',
								args : ['log', logSvnPath, '-r', prevVersion + ':HEAD', '--xml'],
								opts : {
									cwd : srcPath
								}
							};
						}
					});

					//Get logs from last revision
					$cmdSeries(grunt, commands, {
						complete : function(error, result, code){
							if (error){
								grunt.log.errorlns(error).error();
								grunt.fatal([title, 'get logs error!'].join(' '));
							}else{
								var log = '';
								var logs = [];
								var logReg = (/<msg>([\w\W]*?)<\/msg>/g);
								var logRegResult = logReg.exec(result.stdout);
								while(logRegResult && logRegResult[1]){
									logs.push(logRegResult[1]);
									logRegResult = logReg.exec(result.stdout);
								}
								if(logs.length){
									log = logs.join('\n');
								}

								if(log){
									log = log.replace(/\r\n/g, '\n');
								}else{
									log = 'Auto commit by ' + title;
								}

								strLog = log;
								grunt.log.ok(title, 'get logs completed.');
							}
							
							callback();
						}
					});
				});
			}

			jobs.push(function(callback){

				var commands = [];

				commands.push({
					cmd : 'svn',
					args : ['add', '.', '--force'],
					opts : {
						stdio : 'inherit',
						cwd : srcPath
					}
				});

				commands.push({
					cmd : 'svn',
					args : ['commit', '-m', strLog],
					opts : {
						stdio : 'inherit',
						cwd : srcPath
					}
				});

				grunt.log.writeln('svn commit -m\n');
				grunt.log.writeln(strLog);

				$cmdSeries(grunt, commands, {
					complete : function(error, result, code){
						if (error){
							grunt.log.errorlns(error).error();
							grunt.fatal([title, 'error!'].join(' '));
						}else{
							grunt.log.ok('commit', srcPath ,'complete!');
						}
						callback();
					}
				});
			});

			$async.series(jobs, function(){
				grunt.log.ok(title, 'completed.');
				done();
			});

		}
	);
};

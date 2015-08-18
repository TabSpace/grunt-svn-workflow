var $tools = require('../utils/tools');
var $cmdSeries = require('../utils/cmdSeries');
var $askFor = require('ask-for');

module.exports = function(grunt){

	var $async = grunt.util.async;

	var getRevision = function(xml){
		var revision = '';
		var vRegResult = (/revision="(\d+)"/).exec(xml);
		if(vRegResult && vRegResult[1]){
			revision = vRegResult[1];
		}
		return revision;
	};

	var getLog = function(xml){
		var log = '';
		var logReg = (/<msg>([\w\W]*?)<\/msg>/g);
		var logRegResult = logReg.exec(xml);
		if(logRegResult && logRegResult[1]){
			log = logRegResult[1];
		}
		if(log){
			log = log.replace(/\r\n/g, '\n');
		}
		return log;
	};

	grunt.registerMultiTask(
		'svnCopy',
		'Copy svn folders',
		function(){
			var done = this.async();
			var conf = this.options();
			var data = this.data;
			var target = this.target;

			var title = 'task svnCopy' + (target ? ':' + target : '');

			var options = Object.keys(conf).reduce(function(obj, key){
				obj[key] = data[key] || conf[key] || '';
				return obj;
			}, {});

			this.requires(['svnConfig']);

			var regHttpPrev = (/^http\w*\:\/\//);
			var pathFrom = regHttpPrev.test(data.from) ? data.from : $tools.join(options.repository, data.from);
			var pathTo = regHttpPrev.test(data.to) ? data.to : $tools.join(options.repository, data.to);

			var copyLogs = [];
			copyLogs.push('copyfrom : ' + pathFrom);
			
			var folderName = pathFrom.split(/[\/\\]+/).pop();
			var rename = data.rename || '';
			var regBrace = (/\{([^\{\}]+)\}/g);

			var jobs = [];
			var info = {};
			info.name = folderName;

			jobs.push(function(callback){

				var commands = [];

				commands.push({
					cmd : 'svn',
					args : ['info', pathTo],
					autoExecError : false
				});

				// If pathTo not exists, create it
				commands.push(function(error, result, code){
					var json = result.stdout.split(/\n/g).reduce(function(obj, str){
						var index = str.indexOf(':');
						var key = str.substr(0, index).trim().toLowerCase();
						var value = str.substr(index + 1).trim();
						obj[key] = value;
						return obj;
					}, {});

					var cmd = {};

					if(json.url){
						cmd = {
							cmd : 'echo',
							args : ['Check svn path exists.']
						};
					}else{
						grunt.verbose.writeln('The svn path', pathTo, 'not exist. ');
						grunt.verbose.writeln('Auto create svn path', pathTo, '.');
						cmd.cmd = 'svn';
						cmd.args = [
							'mkdir',
							pathTo,
							'--parents',
							'-m',
							'Create svn path by ' + title
						];
						cmd.opts = {
							stdio : 'inherit'
						};
					}

					return cmd;
				});

				// Get log from last revision for pathFrom
				commands.push(function(error, result, code){
					return {
						cmd : 'svn',
						args : ['log', pathFrom, '-l', '1', '--xml']
					};
				});

				// Get pathFrom log and revision from CLI
				$cmdSeries(grunt, commands, {
					complete : function(error, result, code){
						// Get revision
						var revision = getRevision(result.stdout);
						if(revision){
							grunt.log.writeln(title, 'previous revision is', revision);
							info.revision = revision;
							copyLogs.push('revision : ' + revision);
						}else{
							grunt.fatal('Can not get pathFrom revision');
						}

						// Get log
						var log = getLog(result.stdout) || 'Copy by ' + title;
						copyLogs.push('log : ' + log);

						callback();
					}
				});

			});

			jobs.push(function(callback){

				var commands = [];

				commands.push({
					cmd : 'svn',
					args : ['log', pathTo, '-l', 1, '--xml']
				});

				// Get pathTo log from CLI
				$cmdSeries(grunt, commands, {
					complete : function(error, result, code){
						// Get log
						var log = getLog(result.stdout);
						info.lastLog = log;

						callback();
					}
				});

			});

			if($tools.type(data.rename) === 'string'){
				(function(){
					var braceResults = [];
					var result;
					while((result = regBrace.exec(data.rename)) && result[1]){
						braceResults.push(result[1]);
					}

					if(braceResults.indexOf('ask') >= 0){
						jobs.push(function(callback){
							var question = data.question || 'Input message for task svnCopy:' + target + '\n';
							$askFor([question], function(spec) {
								info.ask = spec[question];
								callback();
							});
						});
					}
				})();
			}

			jobs.push(function(callback){
				
				if($tools.type(rename) === 'function'){
					rename = rename(info);
				}

				if($tools.type(rename) !== 'string'){
					rename = '';
				}

				if(!rename){
					rename = info.revision;
				}else{
					rename = $tools.substitute(rename, info);
				}

				copyLogs.push('rename : ' + rename);

				grunt.verbose.writeln('Rename the copy folder:');
				grunt.verbose.writeln(rename);

				var strLog = copyLogs.join('\n');
				var commands = [];

				var targetPath = $tools.join(pathTo, rename);

				// Copy svn folder
				commands.push({
					cmd : 'svn',
					args : ['copy', pathFrom, targetPath, '-m', strLog],
					opts : {
						stdio : 'inherit'
					}
				});

				grunt.verbose.or.writeln('svn', 'copy', pathFrom, targetPath, '-m', '\n' + strLog);

				$cmdSeries(grunt, commands, {
					complete : function(error, result, code){
						callback();
					}
				});

			});

			$async.series(jobs, function(){
				grunt.log.ok(title, 'completed.');
				grunt.log.writeln('');
				done();
			});
		}
	);
};

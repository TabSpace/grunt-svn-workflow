var $tools = require('./tools');

/**
cmdSeries
@param {object} grunt Grunt object.
@param {array} cmds Commands need to run.
@param {object} options Options for commands running.
@example

cmdSeries(grunt, [
	{
		cmd : 'ls',
		args : ['-l'],
		opts : {
			stdio : 'inherit'
		}
	},
	{
		cmd : 'ls'
	},
	function(error, result, code){
		var cmd = {cmd : 'ls'};
		cmd.args = [];
		cmd.args.push('-l');
		cmd.args.push(result.stdout.split('\n')[0]);
		cmd.opts = {
			//子进程信息与主进程同步
			//该选项适于SVN命令,解决需要输入密码的情况
			//注意：此选项开启后，下个命令构造函数，result参数无法取得输出的数据
			stdio : 'inherit'
		}
		return cmd;
	}
], {
	complete : function(error, result, code){
		console.log('[error]:\n', error);
		console.log('[result]:\n', result);
		console.log('[code]:\n', code);
	}
});

**/

var cmdSeries = function(grunt, cmds, options){

	var sheller = {};
	var conf = $tools.extend({
		complete : function(error, result, code){}
	}, options);

	var commands = cmds;
	if($tools.type(cmds) === 'object'){
		commands = [cmds];
	}else if($tools.type(cmds) !== 'array'){
		commands = [];
	}

	commands = commands.map(function(spOptions){
		return function(data, callback){
			if($tools.type(data) === 'function'){
				if(!callback){
					callback = data;
					data = {};
				}
			}

			data = data || {};
			if($tools.type(spOptions) === 'function'){
				spOptions = spOptions(
					data.error,
					data.result,
					data.code
				);
			}

			spOptions = $tools.extend({
				autoExecError : true
			}, spOptions);

			if(!spOptions.cmd){
				grunt.log.writeln('cmd is empty.');
				callback(null, {});
			}

			var strcmd = spOptions.cmd;
			var args = spOptions.args || [];
			if(args && args.join && args.map){
				args = args.map(function(str){
					str = str + '';
					if(str.indexOf('\n') >= 0){
						str = '\n' + str;
					}
					return str;
				});
				strcmd = strcmd + ' ' + args.join(' ');
			}

			grunt.log.writeln('');
			grunt.log.writeln(strcmd);
			grunt.util.spawn(spOptions, function(error, result, code){
				if (error && spOptions.autoExecError){
					grunt.log.errorlns(error).error();
					grunt.fatal([strcmd, 'error'].join(' '));
				}else{
					grunt.log.ok();
				}

				if($tools.type(spOptions.done) === 'function'){
					spOptions.done(error, result, code);
				}
				callback(null, {
					error : error,
					result : result,
					code : code
				});
			});
		};
	});

	grunt.util.async.waterfall(commands, function(error, data){
		data = data || {};
		if($tools.type(conf.complete) === 'function'){
			conf.complete(
				data.error || error,
				data.result,
				data.code
			);
		}
	});

};

module.exports = cmdSeries;




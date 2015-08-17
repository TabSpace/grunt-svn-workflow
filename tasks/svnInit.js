var $fs = require('fs');
var $tools = require('../utils/tools');
var $cmdSeries = require('../utils/cmdSeries');

module.exports = function(grunt){

	var $async = grunt.util.async;

	var getMapPathes = function(map){
		var pathes = [];
		map = map || {};

		var getPathes = function(object, parent){
			var p = '';
			parent = parent || '';
			for(var key in object){
				p = $tools.join(parent, key);
				if(p){
					pathes.push(p);
				}
				if($tools.type(object[key]) === 'object'){
					getPathes(object[key], p);
				}
			}
		};

		getPathes(map);

		return pathes;
	};

	grunt.registerMultiTask(
		'svnInit',
		'Create svn folders with a template.',
		function(arg){

			var done = this.async();
			var conf = this.options();
			var data = this.data;
			var target = this.target;

			var title = 'task svnInit' + (target ? ':' + target : '');

			var options = Object.keys(conf).reduce(function(obj, key){
				obj[key] = data[key] || conf[key] || '';
				return obj;
			}, {});

			this.requires(['svnConfig']);

			var svnPath = options.repository;
			var srcPath = options.cwd;
			var tempPath = $tools.join(srcPath, 'temp/init');

			var commands = [];

			commands.push({
				cmd : 'svn',
				args : ['info', svnPath],
				autoExecError : false
			});

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
						args : ['Create files for ' + json.url]
					};
				}else{
					grunt.verbose.writeln('Auto create svn path', svnPath);
					cmd.cmd = 'svn';
					cmd.args = [
						'mkdir',
						svnPath,
						'--parents',
						'-m',
						'Create folder by svnInit:' + target + ' task'
					];
					cmd.opts = {
						stdio : 'inherit'
					};
				}

				return cmd;
			});

			commands.push(function(error, result, code){

				var motion = 'checkout';
				var cmd = {};
				cmd.cmd = 'svn';

				cmd.args = [];
				cmd.opts = {
					stdio : 'inherit'
				};

				if (!$fs.existsSync(tempPath)){
					motion = 'checkout';
					cmd.args.push('checkout');
					cmd.args.push(svnPath);
					cmd.args.push(tempPath);
				}else{
					motion = 'update';
					cmd.opts.cwd = tempPath;
					cmd.args.push('update');
				}

				return cmd;
			});

			commands.push(function(error, result, code){

				var pathes = getMapPathes(data.map);
				pathes.forEach(function(localPath){
					grunt.verbose.writeln('mkdir:', localPath);
					localPath = $tools.join(tempPath, localPath);
					grunt.file.mkdir(localPath);
				});

				grunt.verbose.writeln('Create', pathes.length, 'folders.');

				var cmd = {
					cmd : 'svn',
					args : ['add', '.', '--force'],
					opts : {
						stdio : 'inherit',
						cwd : tempPath
					}
				};

				return cmd;
			});

			commands.push(function(error, result, code){

				var cmd = {
					cmd : 'svn',
					args : [
						'commit',
						'-m',
						'Create folder by svnInit:' + target + ' task'
					],
					opts : {
						stdio : 'inherit',
						cwd : tempPath
					}
				};

				cmd.done = function(error, result, code){
					grunt.file.delete(tempPath);
				};

				return cmd;
			});

			$cmdSeries(grunt, commands, {
				complete : function(error, result, code){
					grunt.log.ok(title, 'completed.');
					grunt.log.writeln('');
					done();
				}
			});
		}
	);
};



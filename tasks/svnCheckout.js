var $fs = require('fs');
var $tools = require('../utils/tools');
var $cmdSeries = require('../utils/cmdSeries');

module.exports = function(grunt){

	var $async = grunt.util.async;

	grunt.registerMultiTask(
		'svnCheckout',
		'Checkout files to target directory.',
		function(arg){

			var done = this.async();
			var conf = this.options();
			var data = this.data;
			var target = this.target;

			var title = 'task svnCheckout' + (target ? ':' + target : '');

			var options = Object.keys(conf).reduce(function(obj, key){
				obj[key] = data[key] || conf[key];
				return obj;
			}, {});

			this.requires(['svnConfig']);

			var commands = [];

			if(!data.map){
				data.map = {'/' : '/'};
			}

			Object.keys(data.map).forEach(function(localPath){
				var svnPath = data.map[localPath];
				var srcPath = $tools.join(options.cwd, localPath);

				// $path.join will replace 'http://path' 'to http:/path'.
				if(svnPath){
					svnPath = $tools.join(options.repository, svnPath);
				}else{
					svnPath = $tools.join(options.repository, arg);
				}

				var cmd = {};
				var motion = '';

				cmd.cmd = 'svn';

				cmd.args = [];
				cmd.opts = {
					stdio : 'inherit'
				};

				if (!$fs.existsSync(srcPath)){
					motion = 'checkout';
					cmd.args.push('checkout');
					cmd.args.push(svnPath);
					cmd.args.push(srcPath);
				}else{
					motion = 'update';
					cmd.opts.cwd = srcPath;
					cmd.args.push('update');
				}

				commands.push(cmd);
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



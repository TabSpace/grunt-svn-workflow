var $path = require('path');
var $Client = require('svn-spawn');

module.exports = function(grunt){
	grunt.registerTask(
		'svnConfig',
		'Get or set svn repository info',
		function(){
			var done = this.async();

			var conf = grunt.config.get('svnConfig');

			var taskDir = $path.resolve(conf.projectDir, conf.taskDir);
			grunt.log.writeln('Project task directory is ', taskDir);

			if(!conf.repository || conf.repository === 'auto'){
				var client = new $Client({
					cwd : taskDir
				});

				client.getInfo(function(err, data) {
					var svnBasePath = '';
					if(err){
						grunt.log.errorlns(err);
						grunt.fatal('Get svn info failure');
					}else{
						if(data.url){
							svnBasePath = data.url.replace(conf.filter, '');
							grunt.config.set('svnConfig.repository', svnBasePath);
							grunt.log.ok('Project repository url is %s', svnBasePath);
							done();
						}else{
							grunt.fatal('Get svn repository url failure');
						}
					}
				});
			}else{
				done();
			}
		}
	);
};



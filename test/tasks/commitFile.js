var $path = require('path');
var $Client = require('svn-spawn');

module.exports = function(grunt){
	grunt.registerTask(
		'commitFile',
		'Commit a file for unit tests.',
		function(){
			var done = this.async();
			var repository = grunt.config.get('svnConfig.repository');
			var srcPath = $path.resolve('./test/trunk');

			var client = new $Client({
				cwd : srcPath
			});

			var timeStamp = Date.now();
			grunt.config.set('commitFile.timeStamp', timeStamp);

			grunt.file.write($path.join(srcPath, 'js/test.js'), '\/\/' + timeStamp);

			client.addLocal(function(err){
				if(err){
					grunt.log.errorlns(err);
					grunt.fatal('add local ' + srcPath + ' error!');
				}else{
					client.commit(timeStamp, function(err) {
						if (err){
							grunt.log.errorlns(err);
							grunt.fatal('commit : ' + srcPath + ' error!');
						}else{
							done();
						}
					});
				}
			});

		}
	);
};


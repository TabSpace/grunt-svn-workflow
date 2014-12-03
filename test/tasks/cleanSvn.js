module.exports = function(grunt){
	grunt.registerTask(
		'cleanSvn',
		'Clean svn path for unit tests.',
		function(){
			var done = this.async();
			var repository = grunt.config.get('svnConfig.repository');
			var queue = [
				'dev',
				'online'
			].map(function(path){
				var svnPath = repository + path;
				grunt.log.writeln('delete svn path: "' + svnPath + '"');
				return function(callback){
					grunt.util.spawn({
						cmd: 'svn',
						args: ['delete', svnPath, '-m', '"delete ' + path + '"']
					}, function(err, result, code){
						grunt.log.ok('the svn path: "' + svnPath + '" has been deleted!');
						callback();
					});
				};
			});

			grunt.util.async.parallel(queue, function(){
				grunt.log.ok('svn path cleaned!');
				done();
			});
		}
	);
};


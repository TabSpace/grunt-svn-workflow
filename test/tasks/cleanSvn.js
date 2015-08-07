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
				return function(callback){
					grunt.log.writeln('svn delete ' + svnPath + ' -m "delete ' + path + '"');
					grunt.util.spawn({
						cmd: 'svn',
						args: ['delete', svnPath, '-m', '"delete ' + path + '"'],
						opts : {
							stdio : 'inherit'
						}
					}, function(err, result, code){
						grunt.log.ok('the svn path: "' + svnPath + '" has been deleted!');
						callback();
					});
				};
			});

			grunt.util.async.series(queue, function(){
				grunt.log.ok('svn path cleaned!');
				done();
			});
		}
	);
};


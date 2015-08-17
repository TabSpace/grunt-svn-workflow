var $tools = require('../utils/tools');
var $cmdSeries = require('../utils/cmdSeries');
var $askFor = require('ask-for');

module.exports = function(grunt){

	var $async = grunt.util.async;

	grunt.registerMultiTask(
		'svnCopy',
		'Copy svn folders',
		function(){
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
			var pathFrom = regHttpPrev.test(data.from) ? data.from : $tools.join(options.repository, data.from);
			var pathTo = regHttpPrev.test(data.to) ? data.to : $tools.join(options.repository, data.to);
			
			var folderName = pathFrom.split(/[\/\\]+/).pop();
			var rename = data.rename || '';
			rename = $tools.substitute(rename, {
				name : folderName
			});

			if(rename === 'revision'){
				
			}

			console.log('folderName', folderName);
			console.log('pathFrom', pathFrom);
			console.log('pathTo', pathTo);
			console.log('rename', rename);

			done();

		}
	);
};

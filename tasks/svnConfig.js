var $tools = require('../utils/tools');
var $cmdSeries = require('../utils/cmdSeries');

module.exports = function(grunt){

	grunt.registerMultiTask(
		'svnConfig',
		'Get or set svn repository info',
		function(){
			var done = this.async();

			var conf = this.options();
			var data = this.data;
			var target = this.target;

			var from = '';
			var to = '';

			var ok = function(url){
				grunt.log.writeln('Repository url of svnConfig:' + target , ':', url);
				grunt.log.write('Get svn repository url. ').ok();
				done();
			};

			if($tools.type(data) === 'string'){
				ok(data);
				return;
			}

			// 如果配置项是一个对象，那么我们取 from, to 的值，计算出目标SVN路径
			if($tools.type(data) === 'object'){
				from = data.from || process.env.PWD;
				to = data.to || '';
				console.log(from, to);
			}else if(!data){
				from = process.env.PWD;
			}

			grunt.log.writeln('Get repository url from : ', from);

			// from 为本地 svn 文件夹路径
			// 用 svn info 命令获取其 svn 地址，再和 to 选项一起计算目标 svn 路径
			$cmdSeries(grunt, [
				{
					cmd : 'svn',
					args : ['info', from]
				}
			], {
				complete : function(error, result, code){
					var repositoryUrl = '';
					if(error){
						grunt.log.errorlns(error);
						grunt.fatal('Get svn info failure.');
					}else{
						var json = result.stdout.split(/\n/g).reduce(function(obj, str){
							var index = str.indexOf(':');
							var key = str.substr(0, index).trim().toLowerCase();
							var value = str.substr(index + 1).trim();
							obj[key] = value;
							return obj;
						}, {});

						if(json.url){
							repositoryUrl = $tools.join(json.url, to);
							grunt.config.set('svnConfig.' + target, repositoryUrl);
							ok(repositoryUrl);
						}else{
							grunt.fatal('Get svn repository url failure.');
						}
					}
				}
			});
		}
	);
};



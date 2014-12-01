var $askFor = require('ask-for');

/*
 * grunt-svn-workflow
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tony Liang
 * Licensed under the MIT license.
 *
 * @fileoverview Pause the grunt workflow and confirm the action.
 */

module.exports = function(grunt){
	grunt.registerMultiTask(
		'confirm',
		'ask for confirm',
		function(){
			var done = this.async();
			var conf = this.options();
			var data = this.data;

			var ask = '[y/n]';
			var doAsk = function(){
				grunt.log.writeln();
				grunt.log.writeln(data.msg);
				$askFor([ask], function(spec) {
					var ans = spec[ask].toLowerCase();
					if(ans === 'y'){
						grunt.log.ok('tasks continue ...');
						done();
					}else if(ans === 'n'){
						grunt.task.clearQueue();
						grunt.log.ok('tasks cleared!');
						done();
					}else{
						doAsk();
					}
				});
			};
			doAsk();
		}
	);
};


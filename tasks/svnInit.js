var $fs = require('fs');
var $path = require('path');
var $Client = require('svn-spawn');

/*
 * grunt-svn-workflow
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Tony Liang
 * Licensed under the MIT license.
 *
 * @fileoverview Automatically create the directory structure to ensure the normal workflow.
 */

module.exports = function(grunt){

	var $async = grunt.util.async;

	var typeOf = function(object){
		return Object.prototype.toString.call(object)
			.toLowerCase().replace(/^\[object|]$/gi, '').trim();
	};

	var getMapPathes = function(map){
		var pathes = [];
		map = map || {};

		var getPathes = function(object, parent){
			var p = '';
			parent = parent || '';
			for(var key in object){
				p = $path.join(parent, key);
				if(p){
					pathes.push(p);
				}
				if(typeOf(object[key]) === 'object'){
					getPathes(object[key], p);
				}
			}
		};

		getPathes(map);

		return pathes;
	};

	grunt.registerTask(
		'svnInit',
		'Create svn folders with a template.',
		function(arg){
			var that = this;
			var svnConf = grunt.config.get('svnConfig');

			if(!svnConf){
				grunt.fatal('Task svnInit need task: svnConfig.');
			}

			//Build init checkout options.
			var svnInitCheckoutMap = {};
			var svnInitLocalPath = $path.join(svnConf.taskDir, 'temp/init');
			svnInitCheckoutMap[svnInitLocalPath] = '/';
			grunt.config.set('svnCheckout.init', {
				map : svnInitCheckoutMap
			});

			grunt.config.set('svnCommit.init', {
				svn : '/',
				src : svnInitLocalPath
			});

			grunt.registerTask(
				'svnInitWithMap',
				'Mkdir according to map options.',
				function(){
					var queue = [];
					var conf = that.options();
					var tempPath = $path.join(conf.cwd, svnConf.taskDir, 'temp/init');
					var map = grunt.config.get('svnInit.map');

					var pathes = getMapPathes(map);
					pathes.forEach(function(localPath){
						grunt.log.writeln('mkdir:', localPath);
						localPath = $path.join(tempPath, localPath);
						grunt.file.mkdir(localPath);
					});

					grunt.log.writeln('Create', pathes.length, 'folders.');
				}
			);

			grunt.registerTask(
				'svnInitCleanTemp',
				'Clean temp files after init.',
				function(){
					var conf = that.options();
					var tempPath = $path.join(conf.cwd, svnConf.taskDir, 'temp/init');
					grunt.file.delete(tempPath);
				}
			);

			grunt.task.run([
				'svnConfig',
				'svnCheckout:init',
				'svnInitWithMap',
				'svnCommit:init',
				'svnInitCleanTemp'
			]);
		}
	);
};



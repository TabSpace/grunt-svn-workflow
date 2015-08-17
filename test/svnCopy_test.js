'use strict';

var $grunt = require('grunt');
var $path = require('path');
var $tools = require('../utils/tools');
var $cmdSeries = require('../utils/cmdSeries');

exports.svnConfig = function(test){
	test.expect(5);

	var commands = [];

	var timeStamp = $grunt.config.get('timeStamp');
	var repository = $grunt.config.get('svnCopy.options.repository');
	var revisionFile = $path.resolve('./test/test/copy_revision.js');
	var revision = $grunt.file.read(revisionFile);

	['normal', 'fn', 'tpl', 'ask'].forEach(function(name){
		commands.push(function(error, result, code){
			var rename = '';
			if(name === 'normal'){
				rename = revision;
			}else if(name === 'fn'){
				rename = 'svncopy_timestamp_' + timeStamp + '_fn';
			}else if(name === 'tpl'){
				rename = timeStamp + '_normal_' + revision;
			}else if(name === 'ask'){
				rename = timeStamp + '_' + timeStamp + '_ask';
			}

			var svnPath = $tools.join(repository, 'copy', rename);

			var cmd = {
				cmd : 'svn',
				args : ['log', svnPath, '-l', '1', '--xml']
			};

			cmd.done = function(error, result, code){
				test.ok(
					!error,
					'Should get folder ' + rename + ' info without error.'
				);
			};

			cmd.autoExecError = false;

			return cmd;
		});
	});

	$cmdSeries($grunt, commands, {
		complete : function(error, result, code){
			test.ok(
				!error,
				'Should run nodeunit:svnCopy without error.'
			);

			test.done();
		}
	});

};

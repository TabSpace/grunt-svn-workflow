'use strict';

var $grunt = require('grunt');
var $path = require('path');
var $tools = require('../utils/tools');
var $cmdSeries = require('../utils/cmdSeries');

exports.svnCommit = function(test){
	test.expect(5);

	var commands = [];

	var timeStamp = $grunt.config.get('timeStamp');
	var cwdbase = $grunt.config.get('svnCommit.options.cwd');
	var repository = $grunt.config.get('svnCommit.options.repository');

	['normal', 'fn', 'svn', 'ask'].forEach(function(name){
		commands.push(function(error, result, code){
			var svnPath = $tools.join(repository, 'commit', name);
			var srcPath = $tools.join(cwdbase, 'test/commit', name);

			var cmd = {
				cmd : 'svn',
				args : ['log', svnPath, '-l', '1', '--xml'],
				opts : {
					cwd : srcPath
				},
				autoExecError : false
			};

			cmd.done = function(error, result, code){
				var expect = '';
				var log = '';
				var logs = [];
				var logReg = (/<msg>([\w\W]*?)<\/msg>/g);
				var logRegResult = logReg.exec(result.stdout);
				while(logRegResult && logRegResult[1]){
					logs.push(logRegResult[1]);
					logRegResult = logReg.exec(result.stdout);
				}
				if(logs.length){
					log = logs.join('\n');
				}

				log = log || '';
				log = log.replace(/\r\n/g, '\n');

				if(name === 'svn' || name === 'fn'){
					expect = 'svncommit_timestamp_' + timeStamp + '_fn';
				}else if(name === 'ask'){
					expect = timeStamp + '_' + timeStamp + '_ask';
				}else{
					expect = timeStamp + '_' + name;
				}

				test.equal(
					log,
					expect,
					'Should get correct log for ' + name + '.'
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
				'Should run nodeunit:svnCommit without error.'
			);

			test.done();
		}
	});

};


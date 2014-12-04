#grunt-svn-workflow

>Manage your svn folders.

Help you to improve the automation process.

The demo give you a simple, clear, maintainable project directory structure.

The publish task in demo will copy your logs to target folders, from previous commit to now.

You can set a confirm prompt in the task queue.

## For
For whoever have a JavaScript project on a SVN repository, and want to properly maintenance it.

## Prepare
Be sure that SVN version >= 1.6 .

Requires SVN CLI, set language as english.

Create a directory named tools in your project repository path.

Create a local directory of your project named `'projectname'`, then checkout the tools directory to `'projectname/tools'`.

Put your grunt file and package.json in this directory. like this:

![image](https://github.com/Esoul/grunt-svn-workflow/blob/master/resources/images/screenshots/web-project-svn-directories.png)

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-svn-workflow --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-svn-workflow');
```

Be sure that you have stored the svn password, for now these tasks can't give you a prompt that need the password .

Reference demo file to configure your task file, or just copy the configuration.

## svnConfig task
_Set your svn configs in this task , and put the `svnConfig` task in your svn operation task queue._

#### repository
Type: `String`
Default: `''`

The repository url of project. Set it as `'auto'` to let the task get the repository url with `taskDir` option automatically.

#### projectDir
Type: `String`

The local path of the project.

#### taskDir
Type: `String`

The path of the task directory relative to the repository url of project.

### Usage examples
```js
var path = require('path');

// Project svn tasks configuration.
grunt.initConfig({
	svnConfig : {
		// Project svn repository path.
		repository : 'auto',
		// Project deploy path.
		projectDir : path.resolve(__dirname, '../'),
		// Project gruntfile directory.
		taskDir : 'tools'
	}
});
```

## svnInit task
_Run this task with the `grunt svnInit` command._

#### options.repository
Type: `String`

The repository url of project.

#### options.cwd
Type: `String`

The local path of the project.

#### map
Type: `Object`

Describe the SVN directory structure.

### Usage examples
```js
var path = require('path');

grunt.initConfig({
	svnConfig : {
		// Project svn repository path.
		repository : 'auto',
		// Project deploy path.
		projectDir : path.resolve(__dirname, '../'),
		// Project gruntfile directory.
		taskDir : 'tools'
	},
	svnInit : {
		options : {
			repository: '<%=svnConfig.repository%>',
			cwd: '<%=svnConfig.projectDir%>'
		},
		// Build pathes according to the map.
		map : {
			'dev' : {
				'branches' : 'folder',
				'tags' : 'folder',
				'trunk' : {
					'html' : 'folder',
					'css' : 'folder',
					'js' : 'folder'
				}
			},
			'online' : {
				'tags' : 'folder',
				'trunk' : 'folder'
			}
		}
	}
});
```
If you run the task : `grunt svnInit`, you will get the directory structure like this:

![image](https://github.com/Esoul/grunt-svn-workflow/blob/master/resources/images/screenshots/svn-directory-structure.png)

## svnCheckout multitask
_Set your checkout options, then put the task in where you want._

#### options.repository
Type: `String`

The repository url of project.

#### options.cwd
Type: `String`

The local path of the project.

#### map
Type: `Object`

Describe the SVN directory mapping relationship with the local path.

### Usage examples
```js
var path = require('path');

grunt.initConfig({
	svnConfig : {
		// Project svn repository path.
		repository : 'auto',
		// Project deploy path.
		projectDir : path.resolve(__dirname, '../'),
		// Project gruntfile directory.
		taskDir : 'tools'
	},
	svnCheckout : {
		options : {
			repository: '<%=svnConfig.repository%>',
			cwd: '<%=svnConfig.projectDir%>'
		},
		deploy : {
			map : {
				'trunk' : 'dev/trunk',
				'dist' : 'online/trunk'
			}
		}
	}
});
```

## svnCommit multitask
_Set your commit options, then put the task in where you want._

#### options.repository
Type: `String`

The repository url of project.

#### options.cwd
Type: `String`

The local path of the project.

#### logResource
Type: `String`

The commit task can copy logs from a svn path.
It's a relative path.
Set it as `''` to close logs copying.

#### svn
Type: `String`

SVN relative path to be commited.

#### src
Type: `String`

Local relative path to be commited.

### Usage examples
```js
var path = require('path');

grunt.initConfig({
	svnConfig : {
		// Project svn repository path.
		repository : 'auto',
		// Project deploy path.
		projectDir : path.resolve(__dirname, '../'),
		// Project gruntfile directory.
		taskDir : 'tools'
	},
	svnCommit : {
		options : {
			repository: '<%=svnConfig.repository%>',
			cwd: '<%=svnConfig.projectDir%>'
		},
		online : {
			logResource : 'dev/trunk',
			svn : 'online/trunk',
			src : 'tools/temp/online'
		}
	}
});
```

## svnTag multitask
_Set your tag options, then put the task in where you want._

#### options.repository
Type: `String`

The repository url of project.

#### options.cwd
Type: `String`

The local path of the project.

#### dev
Type: `String`

Local relative path for development.

#### devSvn
Type: `String`

Repository relative url for development.

#### devTag
Type: `String`

Tag repository relative url for development.

#### online
Type: `String`

Local relative path for publishing.

#### onlineSvn
Type: `String`

Repository relative url for publishing.

#### onlineTag
Type: `String`

Tag repository relative url for publishing.

### Usage examples
```js
var path = require('path');

grunt.initConfig({
	svnConfig : {
		// Project svn repository path.
		repository : 'auto',
		// Project deploy path.
		projectDir : path.resolve(__dirname, '../'),
		// Project gruntfile directory.
		taskDir : 'tools'
	},
	svnTag : {
		options : {
			repository: '<%=svnConfig.repository%>',
			cwd: '<%=svnConfig.projectDir%>'
		},
		common : {
			dev : 'tools/temp/trunk',
			devSvn : 'dev/trunk',
			devTag : 'dev/tags',
			online : 'tools/temp/online',
			onlineSvn : 'online/trunk',
			onlineTag : 'online/tags'
		}
	}
});
```

## confirm multitask
_Create a simple task and put it in the task queue, to generate a confirm prompt in the running task._

#### msg
Type: `String`

The message of prompts.

### Usage examples
```js
var path = require('path');

grunt.initConfig({
	confirm : {
		distribute : {
			msg : 'publish ?'
		}
	}
});
```














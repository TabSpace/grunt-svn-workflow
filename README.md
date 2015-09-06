#grunt-svn-workflow

[![Build Status: Linux](https://travis-ci.org/tony-302/grunt-svn-workflow.svg?branch=master)](https://travis-ci.org/tony-302/grunt-svn-workflow)
[![dependencies](https://david-dm.org/tony-302/grunt-svn-workflow.png)](http://david-dm.org/tony-302/grunt-svn-workflow)
[![NPM version](http://img.shields.io/npm/v/grunt-svn-workflow.svg)](https://www.npmjs.org/package/grunt-svn-workflow)

[中文](https://github.com/tony-302/grunt-svn-workflow/blob/master/docs/README_zh-cn.md)

> An SVN operation automation solution

Facilitate to realize and improve automatic processes for SVN directory operation.

Example directory provides a simple management process based on SVN project. 

Can copy from the last package to the current log through a SVN route, and use it as the log of the latest code.  

Set a prompt in the task queue, and determine whether to interrupt tasks based on options.  

Realize a configuration with relative path and reuse it for many projects. 

## For

It is used for projects which still need to use SVN. 

## Prepare

node, npm.

SVN >= 1.6

Need to install SVN CLI, set the language edition as English. (Options for CLI installation are provided when Tortoise SVN is installed)

Grunt CLI

## Quick Start

1. Create a svn directory for your project, and use it as the svn root path for project management. 

2. Create a tools directory in svn directory, and use it for storing various automated tools.

3. Create a local directory, and use it as the local root path and for deploying your project. __Attention: it is not a svn directory and not to be detected.__

4. Detect tools directory in the local project directory. 

5. Copy files under example/tools to tools folder under your project directory. 
 > 
 > Suppose your project name is svn-workflow, then, the structure of the local project directory is shown below: 
 > 
 > ![image](https://cloud.githubusercontent.com/assets/550449/5297160/0b58853c-7be7-11e4-888f-a6a567e61445.png)
 > 

6. Install npm component for project independency: 
 > 
 > ```shell
 > npm install -d
 > ```
 >

7. Structure of svn directory of initialized project:
 > 
 > ```shell
 > grunt svnConfig svnInit
 > ```
 >

8. Deploy local project files: 
 > 
 > ```shell
 > grunt deploy
 > ```
 > 

9. Release project files: 
 > 
 > ```shell
 > grunt publish
 > ```
 > 

## Getting Started

1. This plugin is required to use Grunt ~0.4.0  
 > 
 > If you have never used [Grunt](http://gruntjs.com/), please refer to Grunt description: [Getting Started](http://gruntjs.com/getting-started), which introduces how to create a Gruntfile and how to install and use grunt plugin. When you get familiar with this process, install the plugin with the command: 
 > ```shell
 > npm install grunt-svn-workflow --save-dev
 > ```
 > 

2. After the plugin is installed, get it started with javascript code: 
 > 
 > ```js
 > grunt.loadNpmTasks('grunt-svn-workflow');
 > ```
 > 

3. Refer to sample file to configure task file, or directly copy task configuration and use it as the project template. 

## svnConfig multitask

__It is used for configuration of svn root path. If svn root path of the project is obtained from local svn path, task svnConfig should be executed before other tasks are fulfilled.__

__examples__

```js
grunt.registerTask('deploy', [
    'svnConfig',
    'svnCheckout:deploy'
]);
```

#### Task name type: `String`

Type: `String`

Default: `''`

In case of no options but a character string, this character string shall be directly used as svn root path of the project. 

__examples__

```js
grunt.initConfig({
    svnConfig : {
        project : 'https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/'
    }
});
```

#### from

Type: `String`

It is used for obtaining the local svn directory of svn root path. 

#### to

Type: `String` | `Function`

It is the svn path which need to be located finally and the relative path of svn path corresponding to local directory. 

It can be a function, which uses the svn path transmitted as the parameter and figures out the target svn path to be located. 

It facilitates to realize efficient reuse of configuration file after the project directory is standardized and established. 

#### svnConfig usage examples

```js
var path = require('path');
grunt.initConfig({
    svnConfig : {
        project : {
            from : path.resolve(__dirname, 'test/test/base'),
            to : '../'
        },
        compute : {
            from : path.resolve(__dirname, 'test/test/base'),
            to : function(url){
                return url.replace(/base$/, '');
            }
        }
    }
});
```

Suppose the local directory  'test/test/base' is a svn directory, corresponding svn directory is "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/test/base".

After task svnConfig:project is fulfilled, obtain the address of the online svn directory and use it as that of svn root path of the project: 

grunt.config.get('svnConfig.project') === "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/test/"。

## svnInit multitask

__svn directory of initialized project.__

#### options.repository / repository

Type: `String`

Project svn root path. 

#### options.cwd / cwd

Type: `String`

Project local root path.

#### map

Type: `Object`

It describes the structure of svn directory

#### svnInit usage examples

```js
var path = require('path');

grunt.initConfig({
    projectDir : path.resolve(__dirname, '../'),
    svnConfig : {
        project : {
            from : path.resolve(__dirname),
            to : '../'
        }
    },
    svnInit : {
        options : {
            repository: '<%=svnConfig.project%>',
            cwd: '<%=projectDir%>'
        },
        project : {
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
    }
});
```

```shell
grunt svnConfig svnInit
```

Then, figure out the structure of svn directory as below: 

![image](https://cloud.githubusercontent.com/assets/550449/5297204/6d00973e-7be7-11e4-9dcb-08e3e07247ab.png)

## svnCheckout multitask

__It is used for lot inspection of files and directories.__

#### options.repository / repository

Type: `String`

Project svn root path. 

#### options.cwd / cwd

Type: `String`

Project local root path. 

#### map

Type: `Object`

It describes the mapping relation between svn path and local directory. 

It is a key : value format 

key is a relative path to the local root directory 

value is a svnCommit multitask relative to svn  

#### svnCheckout usage examples

```js
var path = require('path');

grunt.initConfig({
    projectDir : path.resolve(__dirname, '../'),
    svnConfig : {
        project : {
            from : path.resolve(__dirname),
            to : '../'
        }
    },
    svnCheckout : {
        options : {
            repository: '<%=svnConfig.project%>',
            cwd: '<%=projectDir%>'
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

```shell
grunt svnConfig svnCheckout
```

## svnCommit multitask

__It is used for submitting the code automatically.__

#### options.repository / repository

Type: `String`

Project svn root path.

#### options.cwd / cwd

Type: `String`

Project local root path. 

#### svn

Type: `String`

It is a relative path to svn root path. 

#### src

Type: `String`

It is a relative path to local root path. 

#### question

Type: `String`

Question prompts are user-defined for keeping the log manually. 

#### log

Type: `String` | `Function`

Log to be submitted. 

It can be set as a function, the returned value can be the log when questions are submitted.

If it is packaged with a bracket, provide a relative path to svn root path. 

If the address is not an absolute path, calculate svn path automatically according to the attribute of repository.

The log of this target svn path will be copied and used as the log to be submitted. 

Copy only the log larger than the current version number of svn target path to be submitted. 

In case of keeping the log manually, {ask} field should exist in the attribute, which will be replaced by information filled manually. 

#### svnCommit usage examples

```js
var path = require('path');

grunt.initConfig({
    projectDir : path.resolve(__dirname, '../'),
    svnConfig : {
        project : {
            from : path.resolve(__dirname),
            to : '../'
        }
    },
    svnCommit : {
        options : {
            repository: '<%=svnConfig.project%>',
            cwd: '<%=projectDir%>'
        },
        // The default log is ："Auto commit by task svnCommit:auto"
        auto : {
            svn : 'online/trunk',
            src : 'trunk'
        },
        // The log should be a string , could use grunt template.
        custom : {
            log : 'custom log.'
            svn : 'online/trunk',
            src : 'trunk'
        },
        // Use a function return the log string.
        useFunction : {
            log : function(){
                return 'custom log ' + Date.now();
            },
            svn : 'online/trunk',
            src : 'trunk'
        },
        // Give a prompt in console. Let the user fill the log.
        ask : {
            log : 'Custom log: {ask}'
            svn : 'online/trunk',
            src : 'tools/temp/online'
        },
        // Custom the prompt in console.
        askCustom : {
            question : 'Input the log:',
            log : 'Custom your logs: {ask}'
            svn : 'online/trunk',
            src : 'tools/temp/online'
        },
        // If svn root path is "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/"。
        // If local project root path is "~/work/svn-workflow/example"
        // Execute the follow task, will commit in directory: "~/work/svn-workflow/example/tools/temp/online" 。
        // Commit to : "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/online/trunk" 。
        // The log will be getted from the svn path: "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/dev/trunk"
        copyLogFrom : {
            log : '[dev/trunk]',
            svn : 'online/trunk',
            src : 'tools/temp/online'
        }
    }
});
```

```shell
grunt svnConfig svnCommit
```

## svnCopy multitask

__Copy a svn directory, and use it for automatic generation of tag process and branch process generally.__

#### options.repository / repository

Type: `String`

Project svn root path. 

#### from

Type: `String`

To copy the directory, fill in relative path to project svn root path. 

#### to

Type: `String`

To copy the directory to the target svn directory, fill in the relative path to project svn root path. 

#### question

Type: `String`

In case of obtain the rename of the directory to the copied from the console, user-define questions of the console through attributes.  

#### rename

Type: `String` | `Function`

Copy the renamed name of the directory. 

In case of rename attribute, use the svn version number (revision) of the directory to be copied as the renamed name. 

User-define the renamed name with a function which will use a json object as the parameter. 

- info : argument of function。
- info.name : name of the directory to be copied. 
- info.revision : current version number of the directory to be copied. 
- info.lastLog : the latest log of the target directory for storing copied directories.
- info.ask : user input obtained from the console. 

Set rename as a template character string, and replace contents in the brace by corresponding attribute value in info object automatically. 

E.g. set rename as '{name}_{revision}'. If the name of the copied directory is trunk, and the latest version number is 13542, the copied directory is renamed as: trunk_13542. 

If '{ask}' field in the attribute of rename, the console will give prompts and request the user to replace this field by files. 

#### svnCopy usage examples

```js
var path = require('path');

grunt.initConfig({
    projectDir : path.resolve(__dirname, '../'),
    svnConfig : {
        project : {
            from : path.resolve(__dirname),
            to : '../'
        }
    },
    svnCopy : {
        options : {
            repository: '<%=svnConfig.project%>'
        },
        // Rename by revision of "online/trunk", copy "online/trunk" to "online/tags/{revision}".
        // If project svn root path is "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/"。
        // Execute the followed task, will copy the directory : "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/online/trunk"
        // If the revision of original directory is 13542, The directory will be copied to svn svnpath:
        // "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/online/tags/13542"
        autoTag : {
            from : 'online/trunk',
            to : 'online/tags'
        },
        // Ask for the name in console.
        branch : {
            question : 'Input the branch name:'.
            rename : 'branch_{ask}',
            from : 'dev/trunk',
            to : 'dev/branches'
        },
        // Give a name by a function.
        // The argument info give the informations for computing.
        tagByCompute : {
            rename : function(info){
                var tagName = '';
                // Compute tagName by info
                return tagName;
            },
            from : 'dev/trunk',
            to : 'dev/branches'
        }
    }
});
```

```shell
grunt svnConfig svnCopy
```

## confirm multitask

__Create a question and answer during task execution to determine whether to continue task flows.__

#### msg

Type: `String`

Prompt message

#### confirm usage examples

```js
grunt.initConfig({
    confirm : {
        distribute : {
            msg : 'publish ?'
        }
    }
});
```

## example

A demo of gruntfile config.

```js
var $path = require('path');

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        toolsDir : $path.resolve(__dirname),
        projectDir : $path.resolve(__dirname, '../'),
        // Clean files for example publish.
        clean: {
            beforePublish: [
                'temp'
            ]
        },
        // Copy files for example publish.
        copy: {
            forPublish: {
                expand : true,
                cwd : 'temp/trunk/',
                src : '**/*',
                dest : 'temp/online/'
            }
        },
        confirm : {
            distribute : {
                msg : 'publish ?'
            }
        },
        svnConfig : {
            project : {
                from : '<%=toolsDir%>',
                to : '../'
            }
        },
        svnInit : {
            options : {
                repository: '<%=svnConfig.project%>',
                cwd: '<%=toolsDir%>'
            },
            project : {
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
        },
        svnCheckout : {
            options : {
                repository: '<%=svnConfig.project%>',
                cwd: '<%=projectDir%>'
            },
            deploy : {
                map : {
                    'dist' : 'online/trunk',
                    'trunk' : 'dev/trunk'
                }
            },
            prepareForPublish : {
                cwd : '<%=toolsDir%>',
                map : {
                    'temp/online' : 'online/trunk',
                    'temp/trunk' : 'dev/trunk'
                }
            }
        },
        svnCommit : {
            options : {
                repository: '<%=svnConfig.project%>',
                cwd: '<%=projectDir%>'
            },
            publish : {
                cwd : '<%=toolsDir%>',
                log : '[dev/trunk]',
                svn : 'online/trunk',
                src : 'temp/online'
            }
        },
        svnCopy : {
            options : {
                repository: '<%=svnConfig.project%>'
            },
            tagForDev : {
                rename : function(info){
                    grunt.config.set('svnCopy.tagForDev.revision', info.revision);
                    return info.revision;
                },
                from : 'dev/trunk',
                to : 'dev/tags'
            },
            tagForOnline : {
                rename : function(info){
                    return grunt.config.get('svnCopy.tagForDev.revision');
                },
                from : 'online/trunk',
                to : 'online/tags'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-svn-workflow');

    grunt.registerTask(
        'deploy',
        'Deploy development environment.',
        [
            'svnConfig',
            'svnCheckout:deploy'
        ]
    );

    grunt.registerTask(
        'prepareForPublish',
        'Copy, pack and compress files, things like that.',
        [
            'clean:beforePublish',
            'svnConfig',
            'svnCheckout:prepareForPublish',
            'copy:forPublish'
        ]
    );

    grunt.registerTask(
        'distribute',
        'Distribute file to online svn folder',
        [
            'confirm:distribute',
            'svnCommit:publish',
            'svnCopy:tagForDev',
            'svnCopy:tagForOnline'
        ]
    );

    grunt.registerTask(
        'publish',
        'The full publish workflow.',
        [
            'prepareForPublish',
            'distribute'
        ]
    );

    grunt.registerTask(
        'default',
        'The default task',
        [
            'deploy'
        ]
    );

};
```

## Release History

 * 2015-08-27 v0.2.5 Provide English document.
 * 2015-08-27 v0.2.4 The "rename" option in svnCopy task could get return value as answer template.
 * 2015-08-26 v0.2.3 The option "to" of task svnConfig could be a function.
 * 2015-08-25 v0.2.2 Fix git url.
 * 2015-08-20 v0.2.1 Improve docs. Give a new example.
 * 2015-08-18 v0.2.0 Important update. Remove svnTag task, add svnCopy task, refactor all task files.
 * 2015-04-01 v0.1.2 Add log option for svnCommit task.
 * 2014-12-09 v0.1.1 Fix the bug that get an error occasionally in task running.
 * 2014-12-04 v0.1.0 The first official release, base on Grunt 0.4.X.





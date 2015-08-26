#grunt-svn-workflow

[![Build Status: Linux](https://travis-ci.org/tony-302/grunt-svn-workflow.svg?branch=master)](https://travis-ci.org/tony-302/grunt-svn-workflow)
[![dependencies](https://david-dm.org/tony-302/grunt-svn-workflow.png)](http://david-dm.org/tony-302/grunt-svn-workflow)
[![NPM version](http://img.shields.io/npm/v/grunt-svn-workflow.svg)](https://www.npmjs.org/package/grunt-svn-workflow)

> 一个 SVN 操作自动化解决方案

帮助实现和改进 SVN 目录操作的自动化流程。

example 目录给出了一个基于 SVN 项目的简单管理流程。

能够从一个 SVN 路径复制从上次打包到当前版本的日志，作为最新发布代码的日志。

在任务队列中可以设置一个提示，根据选择来决定是否中断任务。

使用相对路径，可以实现一套配置，多个项目复用。

## For

用于那些还需要使用 SVN 的项目。

## Prepare

安装 node, npm 环境。

确保 SVN 版本 >= 1.6 。

需要安装 SVN CLI, 设置语言版本为 english 。(Tortoise  SVN 安装时提供了同时安装 CLI 的选项)

需要安装 Grunt CLI 。

## Quick Start

1. 为你的项目创建一个 svn 目录，作为项目管理的 svn 根路径。

2. 在项目 svn 目录里面创建一个 tools 目录，用于存放各种自动化工具。

3. 在本地建立一个目录，作为项目的本地根路径，用于部署你的项目。__注意：这不是 svn 目录，不需要检出。__

4. 将 tools 目录检出到本地项目目录中。

5. 将 example/tools 下的文件复制到你的项目目录中的 tools 文件夹下。
 > 
 > 假设你的项目名称为 svn-workflow ，那么你此时的本地项目目录结构如图所示：
 > 
 > ![image](https://cloud.githubusercontent.com/assets/550449/5297160/0b58853c-7be7-11e4-888f-a6a567e61445.png)
 > 

6. 安装项目依赖的 npm 组件：
 > 
 > ```shell
 > npm install -d
 > ```
 >

7. 初始化项目 svn 目录结构：
 > 
 > ```shell
 > grunt svnConfig svnInit
 > ```
 >

8. 部署本地项目文件：
 > 
 > ```shell
 > grunt deploy
 > ```
 > 

9. 发布项目文件：
 > 
 > ```shell
 > grunt publish
 > ```
 > 

## Getting Started

1. 这个插件要求使用 Grunt `~0.4.0`
 > 
 > 如果你还未使用过 [Grunt](http://gruntjs.com/)，请查阅 Grunt 说明：[Getting Started](http://gruntjs.com/getting-started)，这里解释了如何创建一个 [Gruntfile](http://gruntjs.com/sample-gruntfile) 以及如何安装和使用 grunt 插件。当你熟悉了这个流程，用这个命令来安装这个插件：
 > 
 > ```shell
 > npm install grunt-svn-workflow --save-dev
 > ```
 > 

2. 插件安装后，需要用这行 javascript 代码来启用插件：
 > 
 > ```js
 > grunt.loadNpmTasks('grunt-svn-workflow');
 > ```
 > 

3. 参考示例文件来配置任务文件，也可以直接复制任务配置作为项目模板。

## svnConfig multitask

__用于配置 svn 根路径。如果是从本地 svn 路径来获取项目 svn 根路径，则其他任务执行前都需要先执行 `svnConfig` 任务。__

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

如果不提供选项对象，只填写一个字符串，则此字符串直接作为项目的 svn 根路径。

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

用于获取 svn 根路径的本地 svn 目录。

#### to
Type: `String` | `Function`

最终我们需要定位的 svn 路径与本地目录对应 svn 路径的相对路径。

也可以是一个函数，通过传递的 svn 路径作为参数，运算出要定位的目标 svn 路径。

这种方式有利于在项目目录规范制定后，实现配置文件的高度复用。

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

假设本地目录 'test/test/base' 是一个 svn 目录，对应的 svn 目录是 "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/test/base"。

任务 svnConfig:project 执行后，获取到线上 svn 目录地址作为项目 svn 根目录地址：

grunt.config.get('svnConfig.project') === "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/test/"。

## svnInit multitask

__初始化项目 svn 目录。__

#### options.repository / repository
Type: `String`

项目 svn 根路径。

#### options.cwd / cwd
Type: `String`

项目本地根路径。

#### map
Type: `Object`

描述 svn 目录结构

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

之后得到如下 svn 目录结构：

![image](https://cloud.githubusercontent.com/assets/550449/5297204/6d00973e-7be7-11e4-9dcb-08e3e07247ab.png)

## svnCheckout multitask

__用于批量检出文件与目录。__

#### options.repository / repository
Type: `String`

项目 svn 根路径。

#### options.cwd / cwd
Type: `String`

项目本地根路径。

#### map
Type: `Object`

描述 svn 路径与本地目录的映射关系。

为 key : value 格式

key 为相对于本地根目录的相对路径

value 为相对于 svn 根路径的相对路径

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

__用于自动化提交代码动作。__

#### options.repository / repository
Type: `String`

项目 svn 根路径。

#### options.cwd / cwd
Type: `String`

项目本地根路径。

#### svn
Type: `String`

相对于 svn 根路径的相对路径。

#### src
Type: `String`

相对于本地根路径的相对路径。

#### question
Type: `String`

需要人工填写日志时，自定义提示问题。

#### log
Type: `String` | `Function`

要提交的日志。

可设置为一个函数，其返回值作为提交问件时填充的日志。

如果用中括号包裹，可以提供一个相对于 svn 根路径的相对路径。

如果地址不是绝对路径，则自动根据 repository 属性计算 svn 路径。

该目标 svn 路径的日志将会被复制作为提交日志。

仅复制大于提交 svn 目标路径当前版本号的日志。

如果希望人工填入日志，log 属性中需要存在 {ask} 字段，{ask} 将会被替换为人工填写的信息。

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
        // 如果不提供 log 属性，日志将会是："Auto commit by task svnCommit:auto"
        auto : {
            svn : 'online/trunk',
            src : 'trunk'
        },
        // 可以用一个字符串自定义 log，可以使用 grunt 模板
        custom : {
            log : 'custom log.'
            svn : 'online/trunk',
            src : 'trunk'
        },
        // 可以用一个函数返回需要填充的日志
        useFunction : {
            log : function(){
                return 'custom log ' + Date.now();
            },
            svn : 'online/trunk',
            src : 'trunk'
        },
        // 可以在控制台显示提示，要求用户输入需要填写的日志
        ask : {
            log : '自定义日志：{ask}'
            svn : 'online/trunk',
            src : 'tools/temp/online'
        },
        // 可以自定义控制台提示的问题
        askCustom : {
            question : 'Input the log:',
            log : '自定义日志：{ask}'
            svn : 'online/trunk',
            src : 'tools/temp/online'
        },
        // 假设 svn 根路径为 "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/"。
        // 假设本地项目根路径为 "~/work/svn-workflow/example"
        // 执行下面的任务，将会在这个目录提交代码: "~/work/svn-workflow/example/tools/temp/online" 。
        // 代码被提交到 "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/online/trunk" 。
        // 提交日志从这个 svn 路径获取："https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/dev/trunk"
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

__复制一个 svn 目录，通常用于自动生成 tag 流程和自动生成 branch 流程。__

#### options.repository / repository
Type: `String`

项目 svn 根路径。

#### from
Type: `String`

要拷贝的目录，填写相对于项目 svn 根路径的相对路径。

#### to
Type: `String`

拷贝目录到目标 svn 目录，填写相对于项目 svn 根路径的相对路径。

#### question
Type: `String`

如果要求从控制台获取拷贝目录的重命名，可以通过 question 属性自定义控制台提示的问题。

#### rename
Type: `String` | `Function`

拷贝目录的重命名名称。

如果不提供 rename 属性，则用被拷贝目录的 svn 版本号(revision)作为重命名名称。

可以通过一个函数自定义重命名名称，这个函数会接受一个 json 对象作为参数。

- info : 函数参数。
- info.name : 要拷贝的目录的名称。
- info.revision : 要拷贝的目录的当前版本号。
- info.lastLog : 存放拷贝目录的目标目录的最新日志。
- info.ask : 从控制台获取的用户输入。

可以设置 rename 为一个模板字符串，自动替换花括号里面的内容为 info 对象中对应的属性值。

例如设置 rename 为 '{name}_{revision}' 。如果被拷贝目录名称为 trunk, 最新版本号为 13542, 则拷贝目录被重命名为: trunk_13542 。

如果 rename 属性中存在 '{ask}' 字段，会在控制台给出提示，要求用户输入文案来替换这个字段。

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
        // 用 online/trunk 的版本号作为重命名，复制 online/trunk 目录到 online/tags 下
        // 假设项目 svn 根路径为 "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/"。
        // 执行下面任务，将会复制目录："https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/online/trunk"
        // 如果源目录最新版本号为 13542, 则复制完成后，被复制的 svn 目录最终路径为：
        // "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/online/tags/13542"
        autoTag : {
            from : 'online/trunk',
            to : 'online/tags'
        },
        // 可以在控制台显示提示，要求用户输入被复制目录的重命名名称。
        branch : {
            question : 'Input the branch name:'.
            rename : 'branch_{ask}',
            from : 'dev/trunk',
            to : 'dev/branches'
        },
        // 可以通过一个函数自定义重命名名称。
        // info 参数提供了常用的参与计算的属性。
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

__在任务执行中创建一个问答，来决定任务流程是否继续下去__

#### msg
Type: `String`

提示信息

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

完整的 gruntfile 配置示例:

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






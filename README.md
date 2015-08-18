#grunt-svn-workflow

[![Build Status: Linux](https://travis-ci.org/Esoul/grunt-svn-workflow.svg?branch=master)](https://travis-ci.org/Esoul/grunt-svn-workflow)
[![dependencies](https://david-dm.org/Esoul/grunt-svn-workflow.png)](http://david-dm.org/Esoul/grunt-svn-workflow)
[![NPM version](http://img.shields.io/npm/v/grunt-svn-workflow.svg)](https://www.npmjs.org/package/grunt-svn-workflow)

>用于实现跨平台的 SVN 操作自动化流程

帮助改进 SVN 目录操作的自动化流程。

example 目录给出了一个基于 SVN 项目的简单管理流程。

发布任务能够从一个 SVN 路径复制从上次打包到当前版本的日志，作为最新发布代码的日志。

在任务队列中可以设置一个提示作为中断任务的选择。

## For

用于管理那些还需要在 SVN 进行管理的项目。

## Prepare

安装 node, npm 环境。

确保 SVN 版本 >= 1.6 。

需要安装 SVN CLI, 设置语言版本为 english 。(Tortoise  SVN 安装时提供了同时安装 CLI 的选项)

需要安装 Grunt CLI 。

## Quick Start

0. 登录 svn 仓库，为你的项目创建一个 svn 目录。

0. 在项目 svn 目录里面创建一个 tools 目录。

0. 在本地建立一个目录，用于部署你的项目。__注意：这个目录不能是 svn 目录。__

0. 将 tools 目录检出到本地项目目录中。

0. 将 example/tools 下的文件复制到你的项目目录中的 tools 文件夹下。
> 假设你的项目名称为 svn-workflow ，那么你此时的本地项目目录结构如图所示：
>
>![image](https://cloud.githubusercontent.com/assets/550449/5297160/0b58853c-7be7-11e4-888f-a6a567e61445.png)

0. 安装项目依赖的 npm 包，运行：
> 
> ```shell
> npm install -d
> ```

0. 初始化项目 svn 目录，运行：
> 
> ```shell
> grunt svnInit
> ```

0. 部署本地项目文件，运行：
> 
> ```shell
> grunt
> ```

0. 尝试发布项目文件，运行：
> 
> ```shell
> grunt publish
> ```

## Getting Started

0. 这个插件要求使用 Grunt `~0.4.0`
> 如果你还未使用过 [Grunt](http://gruntjs.com/)，请查阅 Grunt 说明：[Getting Started](http://gruntjs.com/getting-started)，这里解释了如何创建一个 [Gruntfile](http://gruntjs.com/sample-gruntfile) 以及如何安装和使用 grunt 插件。当你熟悉了这个流程，用这个命令来安装这个插件：
> 
> ```shell
> npm install grunt-svn-workflow --save-dev
> ```

0. 插件安装后，需要用这行 javascript 代码来启用插件：
> 
> ```js
> grunt.loadNpmTasks('grunt-svn-workflow');
> ```

0. 请参考示例文件来配置你的任务文件，也可以直接复制任务配置作为项目模板。


## svnConfig multitask

> __用于配置 svn 根路径。如果是从本地 svn 路径来获取项目 svn 根路径，则其他任务执行前都需要先执行 `svnConfig` 任务。__
> 
> __examples__
> 
> ```js
> grunt.registerTask('deploy', [
>     'svnConfig',
>     'svnCheckout:deploy'
> ]);
> ```
> 
> #### Task name type: `String`
> Type: `String`
> Default: `''`
> 
> 如果不提供选项对象，只填写一个字符串，则此字符串直接作为项目的 svn 根路径。
> 
> __examples__
> 
> ```js
> grunt.initConfig({
>     svnConfig : {
>         project : 'https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/'
>     }
> });
> ```
> 
> #### from
> Type: `String`
> 
> 用于获取 svn 根路径的本地 svn 目录。
> 
> #### to
> Type: `String`
> 
> 最终我们需要定位的 svn 路径与本地目录 svn 路径的相对路径。
> 
> #### svnConfig usage examples
> ```js
> var path = require('path');
> grunt.initConfig({
>     svnConfig : {
>         project : {
>             from : path.resolve(__dirname, 'test/test/base'),
>             to : '../'
>         }
>     }
> });
> ```
> 
> 假设本地目录 'test/test/base' 是一个 svn 目录，对应的 svn 目录是 "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/test/base"。
> 
> 任务 svnConfig:project 执行后，获取到线上 svn 目录地址作为项目 svn 根目录地址：
> 
> grunt.config.get('svnConfig.project') === "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/test/"。

## svnInit multitask

> __初始化项目 svn 目录。__
> 
> #### options.repository / repository
> Type: `String`
> 
> 项目 svn 根路径。
> 
> #### options.cwd / cwd
> Type: `String`
> 
> 项目本地根路径。
> 
> #### map
> Type: `Object`
> 
> 描述 svn 目录结构
> 
> #### svnInit usage examples
> ```js
> var path = require('path');
> 
> grunt.initConfig({
>     projectDir : path.resolve(__dirname, '../'),
>     svnConfig : {
>         project : {
>             from : path.resolve(__dirname),
>             to : '../'
>         }
>     },
>     svnInit : {
>         options : {
>             repository: '<%=svnConfig.project%>',
>             cwd: '<%=projectDir%>'
>         },
>         project : {
>             // Build pathes according to the map.
>             map : {
>                 'dev' : {
>                     'branches' : 'folder',
>                     'tags' : 'folder',
>                     'trunk' : {
>                         'html' : 'folder',
>                         'css' : 'folder',
>                         'js' : 'folder'
>                     }
>                 },
>                 'online' : {
>                     'tags' : 'folder',
>                     'trunk' : 'folder'
>                 }
>             }
>         }
>     }
> });
> ```
> 
> ```shell
> grunt svnConfig svnInit
> ```
> 
> 之后得到如下 svn 目录结构：
> 
> ![image](https://cloud.githubusercontent.com/assets/550449/5297204/6d00973e-7be7-11e4-9dcb-08e3e07247ab.png)

## svnCheckout multitask

> __用于批量检出文件与目录。__
> 
> #### options.repository / repository
> Type: `String`
> 
> 项目 svn 根路径。
> 
> #### options.cwd / cwd
> Type: `String`
> 
> 项目本地根路径。
> 
> #### map
> Type: `Object`
> 
> 描述 svn 路径与本地目录的映射关系。
> 
> 为 key : value 格式
> 
> key 为相对于本地根目录的相对路径
> 
> value 为相对于 svn 根路径的相对路径
> 
> #### svnCheckout usage examples
> ```js
> var path = require('path');
> 
> grunt.initConfig({
>     projectDir : path.resolve(__dirname, '../'),
>     svnConfig : {
>         project : {
>             from : path.resolve(__dirname),
>             to : '../'
>         }
>     },
>     svnCheckout : {
>         options : {
>             repository: '<%=svnConfig.project%>',
>             cwd: '<%=projectDir%>'
>         },
>         deploy : {
>             map : {
>                 'trunk' : 'dev/trunk',
>                 'dist' : 'online/trunk'
>             }
>         }
>     }
> });
> ```
> 
> ```shell
> grunt svnConfig svnCheckout
> ```

## svnCommit multitask

> __用于自动化提交代码动作。__
> 
> #### options.repository / repository
> Type: `String`
> 
> 项目 svn 根路径。
> 
> #### options.cwd / cwd
> Type: `String`
> 
> 项目本地根路径。
> 
> #### svn
> Type: `String`
> 
> 相对于 svn 根路径的相对路径。
> 
> #### src
> Type: `String`
> 
> 相对于本地根路径的相对路径。
> 
> #### question
> Type: `String`
> 
> 需要人工填写日志时，自定义提示问题。
> 
> #### log
> Type: `String` | `Function`
> 
> 要提交的日志。
> 
> 可设置为一个函数，其返回值作为提交问件时填充的日志。
> 
> 如果用中括号包裹，可以提供一个相对于 svn 根路径的相对路径。
> 
> 如果地址不是绝对路径，则自动根据 repository 属性计算 svn 路径。
> 
> 该目标 svn 路径的日志将会被复制作为提交日志。
> 
> 仅复制大于提交 svn 目标路径当前版本号的日志。
> 
> 如果希望人工填入日志，log 属性中需要存在 {ask} 字段，{ask} 将会被替换为人工填写的信息。
> 
> #### svnCommit usage examples
> ```js
> var path = require('path');
> 
> grunt.initConfig({
>     projectDir : path.resolve(__dirname, '../'),
>     svnConfig : {
>         project : {
>             from : path.resolve(__dirname),
>             to : '../'
>         }
>     },
>     svnCommit : {
>         options : {
>             repository: '<%=svnConfig.project%>',
>             cwd: '<%=projectDir%>'
>         },
>         // 如果不提供 log 属性，日志将会是："Auto commit by task svnCommit:auto"
>         auto : {
>             svn : 'online/trunk',
>             src : 'trunk'
>         },
>         // 可以用一个字符串自定义 log，可以使用 grunt 模板
>         custom : {
>             log : 'custom log.'
>             svn : 'online/trunk',
>             src : 'trunk'
>         },
>         // 可以用一个函数返回需要填充的日志
>         useFunction : {
>             log : function(){
>                 return 'custom log ' + Date.now();
>             },
>             svn : 'online/trunk',
>             src : 'trunk'
>         },
>         // 可以在控制台显示提示，要求用户输入需要填写的日志
>         ask : {
>             log : '自定义日志：{ask}'
>             svn : 'online/trunk',
>             src : 'tools/temp/online'
>         },
>         // 可以自定义控制台提示的问题
>         askCustom : {
>             question : 'Input the log:',
>             log : '自定义日志：{ask}'
>             svn : 'online/trunk',
>             src : 'tools/temp/online'
>         },
>         // 假设 svn 根路径为 "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/"。
>         // 假设本地项目根路径为 "~/work/svn-workflow/example"
>         // 执行下面的任务，将会在这个目录提交代码: "~/work/svn-workflow/example/tools/temp/online" 。
>         // 代码被提交到 "https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/online/trunk" 。
>         // 提交日志从这个 svn 路径获取："https://svn.sinaapp.com/gruntsvnworkflow/1/svn-workflow/example/dev/trunk"
>         copyFrom : {
>             log : '[dev/trunk]',
>             svn : 'online/trunk',
>             src : 'tools/temp/online'
>         }
>     }
> });
> ```
> 
> ```shell
> grunt svnConfig svnCommit
> ```

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

```

## Release History

 * 2015-08-18   v0.2.0   重大更新，移除 svnTag 任务，添加 svnCopy 任务，更新各个任务使用方式
 * 2015-04-01   v0.1.2   为 svnCommit 任务添加 log 选项
 * 2014-12-09   v0.1.1   解决任务执行时会发生偶然的报错的问题
 * 2014-12-04   v0.1.0   发布第一个正式版本，基于Grunt 0.4.0





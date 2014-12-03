#grunt-svn-workflow

>Manage your svn folders.
>Help you to improve the automation process.
>The demo give you a simple, clearly, maintainable project directory structure.
>The publish task in demo will copy your logs to target folders, from previous commit to now.
>You can set a confirm notice in the task queue.

## For
For whoever have a JavaScript project on a SVN repository, and want to properly maintenance it.

## Prepare


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

these tasks can't give you a need the password prompt for now.

## svnConfig task
_Set your svn configs in this task , and put the `svnConfig` task in your svn operation task queue._

## svnInit task
_Run this task with the `grunt svnInit` command._

## svnCheckout task
_Set your checkout options, then put the task in where you want._

## svnCommit task
_Set your commit options, then put the task in where you want._

## svnTag task
_Set your tag options, then put the task in where you want._

## confirm task
_Create a simple task and put it in the task queue, to generate a confirm notice in the running task._



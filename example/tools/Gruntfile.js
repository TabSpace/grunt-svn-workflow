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

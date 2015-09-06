'use strict'; /* jshint ignore:line */

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ /* jshint ignore:line */
    port: LIVERELOAD_PORT
});
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir)); /* jshint ignore:line */
};

module.exports = function(grunt) { /* jshint ignore:line */
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks); /* jshint ignore:line */

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'), // read package.json to get some info.

        watch: {
            options: {
                nospawn: true
            },

            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'public/*.html',
                    'public/assets/template/**/*.html',
                    'public/assets/styles/scss/**/*.scss',
                    'public/assets/**/*.js',
                    'public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                ]
            },

            micrositescss: {
                files: ['public/assets/styles/scss/microsite/*.scss'],
                tasks: ['sass:microsite']
            },

            homeworkscss: {
                files: ['public/assets/styles/scss/homework/*.scss'],
                tasks: ['sass:homework']
            },

            taskscss: {
                files: ['public/assets/styles/scss/task/*.scss'],
                tasks: ['sass:task']
            },

            fonts: {
                files: ['public/assets/fonts/*'],
                tasks: ['clean:fonts', 'copy:fonts']
            },

            images: {
                files: ['public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'],
                tasks: ['imagemin']
            }

        }, // watch 

        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [ // server root path 
                            mountFolder(connect, 'public'),
                            lrSnippet
                        ];
                    }
                }
            }
        }, // connect as a local server

        open: {
            dev: {
                path: 'http://localhost:<%= connect.options.port %>/microsite.html'
            },
            build: {
                path: 'http://localhost:<%= connect.options.port %>/build/microsite.html'
            }
        }, //open browser

        htmlhint: {
            hint: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': true,
                    'style-disabled': true
                },
                src: ['public/*.html', 'public/assets/template/**/*.html']
            }
        }, // html hint

        sass: {
            options: {
                trace: true,
                style: 'expanded', // normal css style
                update: true // only update when sth changed
            },
            microsite: {
                files: [{
                    expand: true,
                    cwd: 'public/assets/styles/scss/microsite',
                    src: ['*.scss'],
                    dest: 'public/build/assets/stylesheet/microsite',
                    ext: '.css'
                }]
            },
            homework: {
                files: [{
                    expand: true,
                    cwd: 'public/assets/styles/scss/homework',
                    src: ['*.scss'],
                    dest: 'public/build/assets/stylesheet/homework',
                    ext: '.css'
                }]
            },
            task: {
                files: [{
                    expand: true,
                    cwd: 'public/assets/styles/scss/task',
                    src: ['*.scss'],
                    dest: 'public/build/assets/stylesheet/task',
                    ext: '.css'
                }]
            }
        }, //build scss

        uglify: {
            options: {
                sourceMap: true
                    //banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %> */\n'//添加banner
            },
            buildall: { //按原文件结构压缩js文件夹内所有JS文件
                options: {
                    mangle: false, //不混淆变量名
                    preserveComments: 'some', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                },
                files: [{
                    expand: true,
                    cwd: 'public/assets/scripts', //js目录下
                    src: '**/*.js', //所有js文件
                    dest: 'public/build/assets/scripts/' //输出到此目录下
                }]
            }
        }, // js uglify

        concat: {
            options: {
                sourceMap: true,
                mangle: false, //不混淆变量名
                preserveComments: 'some', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                banner: '/*! \n  Project  Name: <%= pkg.name %> \n  Last Modified: <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n' //添加banner
            },
            js: {
                src: [
                    'public/build/javascript/js/app.js'
                ],
                dest: 'public/build/javascript/app-build.js'
            },

            css: {
                src: ['public/build/stylesheet/css/*.css'],
                dest: 'public/build/stylesheet/app.css'
            }
        }, // concat js and css

        cssmin: {
            homework: {
                expand: true,
                cwd: 'public/build/assets/stylesheet/homework/',
                src: ['*.css'],
                dest: 'public/build/assets/stylesheet/homework/min',
                ext: '.css'
            },
            microsite: {
                expand: true,
                cwd: 'public/build/assets/stylesheet/microsite/',
                src: ['*.css'],
                dest: 'public/build/assets/stylesheet/microsite/min',
                ext: '.css'
            },
            task: {
                expand: true,
                cwd: 'public/build/assets/stylesheet/task/',
                src: ['*.css'],
                dest: 'public/build/assets/stylesheet/task/min',
                ext: '.css'
            },
        }, // css min, only app-build.css to min...

        // https://www.npmjs.com/package/grunt-contrib-imagemin
        imagemin: { 
            foldermin: { // target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'public/assets/images/', // Src matches are relative to this path
                    src: ['*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'public/build/assets/images/' // Destination path prefix
                }]
            }
        },

        // https://www.npmjs.com/package/grunt-contrib-clean
        // clean the build or no-use assets and files.
        clean: {
            fonts: ["public/build/assets/fonts/"],
            images: ["public/build/assets/images/"],
            css: ["public/build/assets/stylesheet/"],
            js: ['public/build/assets/scripts/'],
            tpls: ['public/build/assets/template']

        },

        // https://www.npmjs.com/package/grunt-contrib-copy
        // In my opinion, copy is used to copy resource to build path,
        // because build path is a folder that all files should be auto-created.
        copy: {
            fonts: {
                files: [
                    // makes all src relative to cwd
                    {
                        expand: true,
                        cwd: 'public/assets/',
                        src: ['fonts/*'],
                        dest: 'public/build/assets/'
                    }
                ],
            },
            tpl: {
                files: [{
                    expand: true,
                    cwd: 'public/assets/template/',
                    src: ['**/*.html'],
                    dest: 'public/build/assets/template'
                }],
            },
            outer: {
                files: [{
                    expand: true,
                    cwd: 'public/outer',
                    src: ['**/*'],
                    dest: 'public/build/outer'
                }],
            },
        },

        karma: {
            options: { // shared config
                configFile: 'karma.conf.js'
            },
            unit: {
                options: {
                    singleRun: true // specific config example
                }
            }
        },

        jshint: {
            //all: ['gruntfile.js', 'public/assets/scripts/controller/**/*.js']
            ctrlScripts: ['gruntfile.js', 'public/assets/scripts/controller/**/*.js']
        }

    });
    // Tasks config end...
    
    // dev task 
    grunt.registerTask('dev', function(target) { /* jshint ignore:line */
        grunt.task.run([
            'sass',
            'connect:livereload',
            'open:dev',
            'watch'
        ]);
    });

    // build task 
    grunt.registerTask('build', function(target) { /* jshint ignore:line */
        grunt.task.run([
            'clean',
            'sass',
            'cssmin',
            'imagemin',
            'uglify',
            'copy',
            'open:build'
        ]);
    });

    // hint task 
    grunt.registerTask('hint', function(target) { /* jshint ignore:line */
        grunt.task.run([
            'jshint',
            'htmlhint'
        ]);
    });
};


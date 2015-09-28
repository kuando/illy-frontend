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
                    'public/assets/templates/**/*.html',
                    'public/assets/styles/src/scss/**/*.scss',
                    'public/assets/scripts/**/*.js',
                    'public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                ]
            },

            basescss: {
                files: ['public/assets/styles/src/scss/base/**/*.scss'],
                tasks: ['sass:microsite', 'sass:homework', 'sass:task', 'sass:question']
            },

            micrositescss: {
                files: ['public/assets/styles/src/scss/microsite/*.scss'],
                tasks: ['sass:microsite', 'sass:task']
            },

            homeworkscss: {
                files: ['public/assets/styles/src/scss/homework/*.scss'],
                tasks: ['sass:homework']
            },

            taskscss: {
                files: ['public/assets/styles/src/scss/task/*.scss'],
                tasks: ['sass:task']
            },

            question: {
                files: ['public/assets/styles/src/scss/question/*.scss'],
                tasks: ['sass:question']
            },

            fonts: {
                files: ['public/assets/fonts/**/*.*'],
                tasks: ['copy:fonts']
            },

            images: {
                files: ['public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'],
                tasks: ['imagemin']
            },

            mainHtmls: {
                files: ['public/assets/mainHtmls/**/*.html'],
                tasks: ['reGenerateMainHtmls']
            },

            mainScripts: {
                files: ['public/assets/scripts/src/**/*.js'],
                tasks: ['reGenerateMainScripts']
            },

            outer: {
                files: ['public/assets/outer/**/*'],
                tasks: ['reGenerateOuter']
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

        includereplace: {
            generateMainScripts: {
                options: {
                    prefix: '// @@',
                    suffix: ' @@ //'
                },
                // Files to perform replacements and includes with
                src: 'public/assets/scripts/src/**/*.js',
                // Destidistnation directory to copy files to
                dest: 'public/assets/scripts/dist/scripts/'
            },
            generateMainHtmls: {
                options: {
                    prefix: '<!-- @@',
                    suffix: ' @@ -->'
                },
                // Files to perform replacements and includes with
                src: 'public/assets/mainHtmls/*.html',
                // Destidistnation directory to copy files to
                dest: 'public/assets/mainHtmls/dist/'
            },
            generateOuter: {
                options: {
                    prefix: '// @@',
                    suffix: ' @@ //'
                },
                // Files to perform replacements and includes with
                src: 'public/assets/outer/**/*.*',
                // Destidistnation directory to copy files to
                dest: 'public/assets/outer/dist/'
            }
        },

        //压缩HTML
        htmlmin: {
            options: {
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },
            templates: {
                files: [
                    {expand: true, cwd: 'public/assets/templates', src: ['**/*.html'], dest: 'public/build/assets/templates'}
                ]
            }
        },

        sass: {
            options: {
                trace: true,
                style: 'expanded', // normal css style
                update: true // only update when sth changed
            },
            microsite: {
                files: [{
                    expand: true,
                    cwd: 'public/assets/styles/src/scss/microsite',
                    src: ['*.scss'],
                    dest: 'public/assets/styles/microsite',
                    ext: '.css'
                }]
            },
            homework: {
                files: [{
                    expand: true,
                    cwd: 'public/assets/styles/src/scss/homework',
                    src: ['*.scss'],
                    dest: 'public/assets/styles/homework',
                    ext: '.css'
                }]
            },
            task: {
                files: [{
                    expand: true,
                    cwd: 'public/assets/styles/src/scss/task',
                    src: ['*.scss'],
                    dest: 'public/assets/styles/task',
                    ext: '.css'
                }]
            },
            question: {
                files: [{
                    expand: true,
                    cwd: 'public/assets/styles/src/scss/question',
                    src: ['*.scss'],
                    dest: 'public/assets/styles/question',
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
                    cwd: 'public/assets/scripts/', //js目录下
                    src: '**/*.js', //所有js文件
                    dest: 'public/build/assets/scripts/' //输出到此目录下
                }]
            }
        }, // js uglify

        //concat: {
        //    options: {
        //        sourceMap: true,
        //        mangle: false, //不混淆变量名
        //        preserveComments: 'some', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
        //        banner: '/*! \n  Project  Name: <%= pkg.name %> \n  Last Modified: <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n' //添加banner
        //    },
        //    js: {
        //        src: [
        //            'public/build/scripts/**/*.js'
        //        ],
        //        dest: 'public/build/javascript/app-build.js'
        //    },

        //    css: {
        //        src: ['public/build/assets/**/*.css'],
        //        dest: 'public/build/styles/app.css'
        //    }
        //}, // concat js and css

        cssmin: {
            homework: {
                expand: true,
                cwd: 'public/assets/styles/homework/',
                src: ['*.css'],
                dest: 'public/build/assets/styles/homework/',
                ext: '.css'
            },
            microsite: {
                expand: true,
                cwd: 'public/assets/styles/microsite/',
                src: ['*.css'],
                dest: 'public/build/assets/styles/microsite/',
                ext: '.css'
            },
            task: {
                expand: true,
                cwd: 'public/assets/styles/task/',
                src: ['*.css'],
                dest: 'public/build/assets/styles/task/',
                ext: '.css'
            },
            question: {
                expand: true,
                cwd: 'public/assets/styles/question/',
                src: ['*.css'],
                dest: 'public/build/assets/styles/question/',
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
            //fonts: ["public/build/assets/fonts/"],
            //images: ["public/build/assets/images/"],
            //css: ["public/build/assets/styles/"],
            //js: ['public/build/assets/scripts/'],
            //templates: ['public/build/assets/templates'],
            dev: ['public/*.html', 'public/outer/'], // for build
            build: ['public/build/'], // for release
            mainHtmlsDist: ['public/assets/mainHtmls/dist/'], // for dev
            mainScriptsDist: ['public/assets/scripts/dist/'], // for dev
            outerDist: ['public/assets/outer/dist/'] // for dev
        },

        // https://www.npmjs.com/package/grunt-contrib-copy
        // In my opinion, copy is used to copy resource to build path,
        // because build path is a folder that all files should be auto-created.
        copy: {
            mainHtmls: { // for dev
                files: [{
                    expand: true,
                    cwd: 'public/assets/mainHtmls/dist/public/assets/mainHtmls/',
                    src: ['*.html'],
                    dest: 'public/'
                }],
            },
            mainScripts: { // for dev
                files: [{
                    expand: true,
                    cwd: 'public/assets/scripts/dist/scripts/public/assets/scripts/src',
                    src: ['*.js'],
                    dest: 'public/assets/scripts/'
                }],
            },
            outer: { // for dev
                files: [{
                    expand: true,
                    cwd: 'public/assets/outer/dist/public/assets/outer/',
                    src: ['**/*'],
                    dest: 'public/outer'
                }],
            },
            fonts: { // for release
                files: [
                    // makes all src relative to cwd
                    {
                        expand: true,
                        cwd: 'public/assets/fonts/',
                        src: ['**/*'],
                        dest: 'public/build/assets/fonts'
                    }
                ],
            },
            releaseMainHtmls: { // for release
                files: [
                    // makes all src relative to cwd
                    {
                        expand: true,
                        cwd: 'public/',
                        src: ['*.html'],
                        dest: 'public/build/'
                    }
                ],
            },
            releaseOuter: { // for release
                files: [
                    // makes all src relative to cwd
                    {
                        expand: true,
                        cwd: 'public/outer/',
                        src: ['**/*'],
                        dest: 'public/build/outer/'
                    }
                ],
            }
            //templates: {
            //    files: [{
            //        expand: true,
            //        cwd: 'public/assets/templates/',
            //        src: ['**/*.html'],
            //        dest: 'public/build/assets/templates'
            //    }],
            //},
            //outer: {
            //    files: [{
            //        expand: true,
            //        cwd: 'public/outer',
            //        src: ['**/*'],
            //        dest: 'public/build/outer'
            //    }],
            //},
            //index: {
            //    files: [{
            //        expand: true,
            //        cwd: 'public/',
            //        src: ['index.html'],
            //        dest: 'public/build/'
            //    }],
            //},
            //unbind: {
            //    files: [{
            //        expand: true,
            //        cwd: 'public/',
            //        src: ['unbind.html'],
            //        dest: 'public/build/'
            //    }],
            //},
            //login: {
            //    files: [{
            //        expand: true,
            //        cwd: 'public/',
            //        src: ['login.html'],
            //        dest: 'public/build/'
            //    }],
            //},
            //404: {
            //    files: [{
            //        expand: true,
            //        cwd: 'public/',
            //        src: ['404.html'],
            //        dest: 'public/build/'
            //    }],
            //},
        },

        htmlhint: {
            hint: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': false,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': true,
                    'style-disabled': false 
                },
                src: ['public/*.html', 'public/assets/templates/**/*.html']
            }
        }, // html hint

        jshint: {
            //all: ['gruntfile.js', 'public/assets/scripts/controller/**/*.js']
            ctrlScripts: ['gruntfile.js', 'public/assets/scripts/controller/**/*.js']
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
        }

    });
    // Tasks config end...
    
    grunt.registerTask('buildimages', 'minify the images to build folder...', ['imagemin']);
    grunt.registerTask('buildtemplates', 'minify the templates to build folder...', ['htmlmin:templates']);
    grunt.registerTask('buildcss', 'minify the css to build folder...', ['sass', 'cssmin']);
    grunt.registerTask('buildjs', 'uglify the js to build folder...', ['uglify']);

    grunt.registerTask('reGenerateMainHtmls', 'reGenerateMainHtmls...', ['includereplace:generateMainHtmls', 'copy:mainHtmls', 'clean:mainHtmlsDist']);
    grunt.registerTask('reGenerateMainScripts', 'reGenerateMainScripts...', ['includereplace:generateMainScripts', 'copy:mainScripts', 'clean:mainScriptsDist']);
    grunt.registerTask('reGenerateOuter', 'reGenerateOuter...', ['includereplace:generateOuter', 'copy:outer', 'clean:outerDist']);

    // hint task 
    grunt.registerTask('hint', function(target) { /* jshint ignore:line */
        grunt.task.run([
            'htmlhint',
            'jshint'
        ]);
    });
    
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
            'clean:dev',
            'sass',
            'reGenerateMainHtmls',
            'reGenerateMainScripts',
            'reGenerateOuter'
        ]);
    });

    // release task 
    grunt.registerTask('release', function(target) { /* jshint ignore:line */
        grunt.task.run([
            'hint',
            'clean:build',
            'copy:fonts',
            'buildimages',
            'buildjs',
            'buildcss',
            'buildtemplates',
            'copy:releaseMainHtmls',
            'copy:releaseOuter'
        ]);
    });

};


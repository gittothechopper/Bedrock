// Generated on 2013-09-17 using generator-webapp 0.4.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/**/*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    grunt.loadNpmTasks('assemble');
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        assets: 'app/assets'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            assemble: {
                files: ['<%=yeoman.app %>/templates/layouts/*.hbs',
                       '<%=yeoman.app %>/templates/pages/*.hbs',
                       '<%=yeoman.app %>/templates/partials/*.hbs'],
                tasks: ['assemble:server']
            },
            compass: {
                files: ['<%=yeoman.assets %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%=connect.options.livereload %>'
                },
                files: [
                    '.tmp/*.html',
                    '.tmp/assets/styles/**/*.css',
                    '{.tmp,<%=yeoman.app %>}/assets/scripts/**/*.js',
                    '<%=yeoman.assets %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        assemble: {
            options: {
                flatten: true,
                layoutdir: '<%=yeoman.app %>/templates/layouts',
                layout: 'layout.hbs',
                assets: 'dist/images',
                partials: ['<%=yeoman.app %>/templates/partials/*.hbs'],
                data: ['config.json']
            },
            dist: {
                expand: true,
                cwd: '<%=yeoman.app %>/templates/pages',
                src: ['*.hbs'],
                dest: '.tmp/'
            },
            server: {
                expand: true,
                cwd: '<%=yeoman.app %>/templates/pages',
                src: ['*.hbs'],
                dest: '.tmp/'
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        yeomanConfig.app
                    ]
                }
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        yeomanConfig.app,
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: yeomanConfig.dist
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp/**/*.*',
                        '.tmp',
                        '<%=yeoman.dist %>/**/*',
                        '!<%=yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp/**/*.*',
                        '.tmp'
                    ]
                }]
            },
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%=yeoman.assets %>/scripts/**/*.js',
                '!<%=yeoman.assets %>/scripts/vendor/*',
                'test/spec/**/*.js'
            ]
        },
        compass: {
            options: {
                sassDir: '<%=yeoman.assets %>/styles',
                cssDir: '.tmp/assets/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%=yeoman.assets %>/images',
                javascriptsDir: '<%=yeoman.assets %>/scripts',
                fontsDir: '<%=yeoman.assets %>/styles/fonts',
                importPath: '<%=yeoman.assets %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false
            },
            dist: {
                options: {
                    environment: 'production',
                    generatedImagesDir: '<%=yeoman.dist %>/images/generated',
                    outputStyle: 'compressed',
                    debugInfo: false

                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['ios 5', 'ios 5.1', 'ios 6', 'ios 6.1', 'ios 7']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/assets/styles/',
                    src: '**/*.css',
                    dest: '.tmp/assets/styles/'
                }]
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        useminPrepare: {
            options: {
                dest: '<%=yeoman.dist %>'
            },
            html: '.tmp/*.html'
        },
        usemin: {
            options: {
                dirs: ['<%=yeoman.dist %>']
            },
            html: ['<%=yeoman.dist %>/**/*.html'],
            css: ['<%=yeoman.dist %>/styles/**/*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%=yeoman.assets %>/img',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: '<%=yeoman.dist %>/assets/img'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%=yeoman.assets %>/img',
                    src: '**/*.svg',
                    dest: '<%=yeoman.dist %>/assets/img'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%=yeoman.dist %>/styles/main.css': [
            //             '.tmp/styles/**/*.css',
            //             '<%=yeoman.assets %>/styles/**/*.css'
            //         ]
            //     }
            // }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%=yeoman.app %>',
                    dest: '<%=yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/**/*.{webp,gif}',
                        'styles/fonts/**/*.*',
                        '<%=yeoman.app %>/bower_components/sass-bootstrap/fonts/*.*'
                    ]
                }]
            },
            html: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.tmp',
                    dest: '<%=yeoman.dist %>',
                    src: [
                        '*.html'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%=yeoman.assets %>/styles',
                dest: '.tmp/assets/styles/',
                src: '**/*.css'
            },
            pages: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.tmp/assets/styles/pages',
                    dest: '<%=yeoman.dist %>/assets/styles/pages',
                    src: [
                        '*.css'
                    ]
                }]
            }
        },
        concurrent: {
            server: [
                'compass',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'compass',
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },
        bower: {
            options: {
                exclude: ['modernizr']
            },
            all: {
                rjsConfig: '<%=yeoman.assets %>/scripts/main.js'
            }
        },
        irepper: {
            default: {
                src: '<%=pkg.dest_jekyll %>',
                dest: '<%=pkg.dest_irep %>',
                assets: '<%=pkg.assets %>',
                global_assets: ['img/global', 'css', 'js', 'fonts'],
                prefix: '<%=pkg.prefix %>',
                suffix: '<%=pkg.suffix %>',
                separator: '<%=pkg.separator %>',
                login: {
                    username: '<%=pkg.username %>',
                    password: '<%=pkg.password %>'
                },
                product: '<%=pkg.product %>',
                CLM_ID_vod__c: '<%=pkg.CLM_ID_vod__c %>',
            }
        },

        tester: {
            default: {
                src: '<%=pkg.dest_jekyll %>',
                assets: '<%=pkg.assets %>'
            }
        }

    });

    // Load iRepper tasks.
    grunt.loadTasks('tasks');

    grunt.registerTask('irep', [
        'clean:dist',
        'compass:dist',
        'assemble:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'copy:html',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'copy:pages',
        'usemin',
        'irepper'
    ]);

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'assemble:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'compass:dist',
        'assemble:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'copy:html',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'copy:pages',
        'usemin',
        'remove_unused'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};

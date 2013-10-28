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
		assets: 'assets'
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
			sass: {
				files: ['<%=yeoman.app %>/<%=yeoman.assets %>/css/**/*.{scss, sass}'],
				tasks: ['sass', 'autoprefixer']
			},
			livereload: {
				options: {
					livereload: '<%=connect.options.livereload %>'
				},
				files: [
					'.tmp/*.html',
					'.tmp/<%=yeoman.assets %>/css/**/*.css',
					'{.tmp,<%=yeoman.app %>}/<%=yeoman.assets %>/js/**/*.js',
					'<%=yeoman.app %>/<%=yeoman.assets %>/img/**/*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},
		assemble: {
			options: {
				flatten: true,
				layoutdir: '<%=yeoman.app %>/templates/layouts',
				layout: 'layout.hbs',
				assets: 'dist/img',
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
				'<%=yeoman.app %>/<%=yeoman.assets %>/js/**/*.js',
				'!<%=yeoman.app %>/<%=yeoman.assets %>/js/vendor/*',
				'test/spec/**/*.js'
			]
		},
		sass: {
			// Can't use this to compress css atm due to a bug
			globalcss: {
				files: {
				  '.tmp/<%=yeoman.assets %>/css/main.css': '<%=yeoman.app %>/<%=yeoman.assets %>/css/*.scss'
				}
			},
			pages: {
				expand: true,
				cwd: '<%=yeoman.app %>/<%=yeoman.assets %>/css/pages/',
				src: '*.scss',
				dest: '.tmp/<%=yeoman.assets %>/css/pages/',
				ext: '.css'
			}
		},
		autoprefixer: {
			options: {
				browsers: ['ios 5', 'ios 5.1', 'ios 6', 'ios 6.1', 'ios 7']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/<%=yeoman.assets %>/css/',
					src: '**/*.css',
					dest: '.tmp/<%=yeoman.assets %>/css/'
				}]
			}
		},
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
			css: ['<%=yeoman.dist %>/<%=yeoman.assets %>/css/**/*.css']
		},
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%=yeoman.app %>',
					src: '**/*.{png,jpg,jpeg}',
					dest: '<%=yeoman.dist %>'
				}]
			}
		},
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%=yeoman.app %>/<%=yeoman.assets %>/img',
					src: '**/*.svg',
					dest: '<%=yeoman.dist %>/<%=yeoman.assets %>/img'
				}]
			}
		},
		uglify: {
			minify: {
				expand: true,
				cwd: '<%=yeoman.app %>/<%=yeoman.assets %>/js/pages',
				src: ['*.js'],
				dest: '<%=yeoman.dist %>/<%=yeoman.assets %>/js/pages',
				ext: '.js'
			}
		},
		cssmin: {
			pages: {
				files: [{
					expand: true,
					dot: true,
					cwd: '.tmp/<%=yeoman.assets %>/css/pages',
					dest: '<%=yeoman.dist %>/<%=yeoman.assets %>/css/pages',
					src: [
						'*.css'
					]
				}]
			}
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
						'*.{ico,png,txt,md}',
						'.htaccess',
						'assets/img/**/*.{webp,gif}',
						'css/fonts/**/*.*',
						'assets/**/*.{pdf,mp4}'
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
						'**/*.html'
					]
				}]
			}
		},
		concurrent: {
			server: [
				'sass'
			],
			dist: [
				'imagemin',
				'svgmin'
			]
		},
		irepper: {
			default: {
				src: '<%=pkg.dest_jekyll %>',
				dest: '<%=pkg.dest_irep %>',
				assets: '<%=pkg.assets %>',
				global_assets: ['img/global', 'fonts'],
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
		'dev_warn',
		'clean:dist',
		'sass',
		'autoprefixer',
		'assemble:dist',
		'copy:html',
		'copy:dist',
		'useminPrepare',
		'concurrent:dist',
		'concat',
		'cssmin',
		'uglify',
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
		'dev_warn',
		'clean:dist',
		'sass',
		'autoprefixer',
		'assemble:dist',
		'copy:html',
		'copy:dist',
		'useminPrepare',
		'concurrent:dist',
		'concat',
		'cssmin',
		'uglify',
		'usemin'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build'
	]);
};

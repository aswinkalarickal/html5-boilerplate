module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> | ' +
        'Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> */',

        connect: {
            server: {
                options: {
                    hostname: '0.0.0.0',
                    port: 4000,
                    base: '<%= pkg.config.src %>',
                    livereload: true,
                    open: true
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },

            sass: {
                files: ['<%= pkg.config.src %>/sass/*.scss'],
                tasks: ['sass', 'postcss']
            },

            html: {
                files: ['<%= pkg.config.src %>/**/*.html']
            },

            scripts: {
                files: ['<%= pkg.config.src %>/scripts/*.js']
            },

            images: {
                files: ['<%= pkg.config.src %>/**/*.{png,jpg,jpeg,gif,webp,svg}']
            }
        },

        sass: {
            dev: {
                files: {
                    '<%= pkg.config.src %>/styles/style.css' : '<%= pkg.config.src %>/sass/style.scss'
                }
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dev: {
                src: '<%= pkg.config.src %>/styles/*.css'
            }
        },

        clean: {
            build: ['<%= pkg.config.dest %>'],
            release: []
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= pkg.config.src %>',
                        src: [
                            '**/*.html',
                            'favicon.ico',
                            'robots.txt',
                            'sitemap.xml'
                        ],
                        dest: '<%= pkg.config.dest %>'
                    }
                ]
            }
        },

        useminPrepare: {
            html: '<%= pkg.config.src %>/index.html',
            options: {
                dest: '<%= pkg.config.dest %>'
            }
        },

        usemin: {
            html: ['<%= pkg.config.dest %>/index.html'],
            css: ['<%= pkg.config.dest %>/styles/*.css'],
            js: ['<%= pkg.config.dest %>/scripts/*.js']
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= pkg.config.dest %>',
                    src: ['**/*.html'],
                    dest: '<%= pkg.config.dest %>'
                }]
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.config.src %>',
                    src: ['**/*.{png,jpg,gif,svg}', '!bower_components/**'],
                    dest: '<%= pkg.config.dest %>'
                }]
            }
        },

        cssmin: {
            options: {
                keepSpecialComments: 0
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: false
            }
        },

        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            source: {
                files: [{
                    src: [
                        '<%= pkg.config.dest %>/scripts/*.js',
                        '<%= pkg.config.dest %>/styles/*.css',
                        '<%= pkg.config.dest %>/images/*.{png,jpg,gif,svg}'
                    ]
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('serve', ['connect', 'watch']);

    grunt.registerTask('build', [
        'clean:build',
        'sass',
        'postcss',
        'copy',
        'useminPrepare',
        'imagemin',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

};

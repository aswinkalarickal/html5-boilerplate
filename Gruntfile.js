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
                    base: '<%= pkg.app %>',
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
                files: ['<%= pkg.app %>/sass/*.scss'],
                tasks: ['sass', 'postcss']
            },

            html: {
                files: ['<%= pkg.app %>/**/*.html']
            },

            scripts: {
                files: ['<%= pkg.app %>/scripts/*.js']
            },

            images: {
                files: ['<%= pkg.app %>/**/*.{png,jpg,jpeg,gif,webp,svg}']
            }
        },

        sass: {
            dev: {
                files: {
                    '<%= pkg.app %>/styles/style.css' : '<%= pkg.app %>/sass/style.scss'
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
                src: '<%= pkg.app %>/styles/*.css'
            }
        },

        clean: {
            build: ['<%= pkg.dist %>'],
            release: []
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= pkg.app %>',
                        src: [
                            '**/*.html',
                            'favicon.ico',
                            'robots.txt',
                            'sitemap.xml'
                        ],
                        dest: '<%= pkg.dist %>'
                    }
                ]
            }
        },

        useminPrepare: {
            html: '<%= pkg.app %>/index.html',
            options: {
                dest: '<%= pkg.dist %>'
            }
        },

        usemin: {
            html: ['<%= pkg.dist %>/index.html'],
            css: ['<%= pkg.dist %>/styles/*.css'],
            js: ['<%= pkg.dist %>/scripts/*.js']
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
                    cwd: '<%= pkg.dist %>',
                    src: ['**/*.html'],
                    dest: '<%= pkg.dist %>'
                }]
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.app %>',
                    src: ['**/*.{png,jpg,gif,svg}', '!bower_components/**'],
                    dest: '<%= pkg.dist %>'
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
                        '<%= pkg.dist %>/scripts/*.js',
                        '<%= pkg.dist %>/styles/*.css',
                        '<%= pkg.dist %>/images/*.{png,jpg,gif,svg}'
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

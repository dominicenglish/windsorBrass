module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concurrent: {
            default: {
                tasks: ['nodemon:default', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        jshint: {
            all: ['gruntfile.js', 'public/js/**/*.js', 'index.js', 'app/**/*.js']
        },
        nodemon: {
            default: {
                script: 'index.js',
                options: {
                    watch: ['index.js', 'app/**'],
                    cwd: __dirname
                }
            }
        },
        sass: {
            default: {
                options: {
                    style: 'compressed',
                    sourcemap: true
                },
                files: {
                    'public/css/main.css': 'public/css/sass/main.scss'
                }
            }
        },
        watch: {
            jade: {
                files: ['app/views/**/*.jade'],
                options: {
                    livereload: true
                },
            },
            js: {
                files: ['index.js', 'public/js/**', 'app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['public/css/*.css'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['public/css/sass/**/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.option('force', true);

    grunt.registerTask('default', ['jshint', 'concurrent:default']);
};
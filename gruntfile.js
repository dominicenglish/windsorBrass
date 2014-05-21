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
            all: ['gruntfile.js', 'client/js/**/*.js', 'index.js', 'server/**/*.js']
        },
        nodemon: {
            default: {
                script: 'index.js',
                options: {
                    watch: ['index.js', 'server/**'],
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
                    'client/css/main.css': 'client/css/sass/main.scss'
                }
            }
        },
        watch: {
            jade: {
                files: ['server/views/**/*.jade'],
                options: {
                    livereload: true
                },
            },
            js: {
                files: ['index.js', 'client/js/**', 'server/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['client/css/*.css'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['client/css/sass/**/*.scss'],
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
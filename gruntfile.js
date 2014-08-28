module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concurrent: {
            default: {
                tasks: ['watch', 'nodemon'],
                options: {
                    logConcurrentOutput: true
                }
            },
            debug: {
                tasks: ['watch', 'nodemon:debug', 'node-inspector'],
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
                script: 'server/index.js',
                options: {
                    watch: ['server'],
                    cwd: __dirname
                }
            },
            debug: {
                script: 'server/index.js',
                options: {
                    watch: ['server'],
                    cwd: __dirname,
                    nodeArgs: ['--debug']
                }
            }
        },
        sass: {
            default: {
                options: {
                    style: 'compressed',
                    loadPath: 'client/css/sass'
                },
                files: {
                    'client/css/main.css': 'client/css/sass/main.scss'
                }
            }
        },
        jade: {
            default: {
                options: {
                    pretty: true
                },
                files: [{
                    cwd: "client/modules",
                    src: "**/*.jade",
                    dest: "client/modules",
                    expand: true,
                    ext: ".html"
                }]
            }
        },
        'node-inspector': {
            default: {
                options: {
                    'web-port': 8080,
                    'web-host': 'localhost',
                    'debug-port': 5858
                }
            }
        },
        watch: {
            jade: {
                files: ['server/views/**/*.jade'],
                options: {
                    livereload: true
                }
            },
            clientJade: {
                files: ['client/modules/**/*.jade'],
                tasks: ['jade'],
                options: {
                    livereload: true
                }
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
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-node-inspector');

    grunt.option('force', true);

    grunt.registerTask('default', ['jshint', 'concurrent:default']);
    grunt.registerTask('debug', ['jshint', 'concurrent:debug']);
    grunt.registerTask('partials', ['jade']);
};
'use strict';
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concurrent: {
            default: {
                tasks: ['watch', 'nodemon', 'karma:unit:start'],
                options: {
                    logConcurrentOutput: true
                }
            },
            serve: {
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
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                freeze: true,
                immed: true,
                indent: 4,
                latedef: 'nofunc',
                newcap: true,
                noarg: true,
                noempty: true,
                nonbsp: true,
                nonew: true,
                quotmark: true,
                undef: true,
                unused: true,
                strict: true,
                globals: {
                    angular: false,
                    module: true,
                    '__dirname': false
                },
                jquery: true,
                browser: true
            },
            client: {
                options: {
                    bitwise: true,
                    camelcase: true,
                    curly: true,
                    eqeqeq: true,
                    forin: true,
                    freeze: true,
                    immed: true,
                    indent: 4,
                    latedef: 'nofunc',
                    newcap: true,
                    noarg: true,
                    noempty: true,
                    nonbsp: true,
                    nonew: true,
                    quotmark: true,
                    undef: true,
                    unused: true,
                    strict: true,
                    globals: {
                        angular: false,
                        module: true,
                        '__dirname': false
                    },
                    jquery: true,
                    browser: true
                },
                files: {
                    src: [
                        'client/js/**/*.js',
                        'client/modules/**/*.js'
                    ]
                }
            },
            server: {
                options: {
                    node: true,
                    camelcase: false
                },
                files: {
                    src: [
                        'gruntfile.js',
                        'index.js',
                        'server/**/*.js'
                    ]
                }
            },
            test: {
                options: {
                    globals: {
                        describe: false,
                        it: false,
                        beforeEach: false,
                        afterEach: false,
                        expect: false,
                        inject: false,
                        module: false,
                        spyOn: false,
                        angular: false,
                        jasmine: false
                    }
                },
                files: {
                    src: [
                        'test/**/*.js'
                    ]
                }
            }
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
                    cwd: 'client/modules',
                    src: '**/*.jade',
                    dest: 'client/modules',
                    expand: true,
                    ext: '.html'
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
        karma: {
            unit: {
                configFile: 'config/karma.conf.js',
                background: false,
                singleRun: false
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true
            },
            default: {
                files: [
                    {
                        expand: true,
                        cwd: 'client/modules/',
                        src: '**/*.js',
                        dest: 'client/dist/min'
                    },
                    {
                        expand: true,
                        cwd: 'client/js/',
                        src: '**/*.js',
                        dest: 'client/dist/min'
                    }
                ]
            }
        },
        concat: {
            options: {
                sourceMap: 'true'
            },
            dist: {
                src: [
                    'client/lib/angular-messages/angular-messages.min.js',
                    'client/lib/angular-scroll/angular-scroll.min.js',
                    'client/lib/angular-resource/angular-resource.min.js',
                    'client/lib/angular-animate/angular-animate.min.js',
                    'client/lib/angular-ui-router/release/angular-ui-router.min.js',
                    'client/lib/angular-touch/angular-touch.min.js',
                    'client/lib/lodash/dist/lodash.underscore.min.js',
                    'client/lib/angular-google-maps/dist/angular-google-maps.min.js',
                    'client/lib/velocity/velocity.min.js',
                    'client/lib/velocity/velocity.ui.min.js',
                    'client/dist/min/**/*-module.js',
                    'client/dist/min/app.js',
                    'client/dist/min/**/*.js'],
                dest: 'client/dist/concat.js'
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
                files: ['index.js', 'client/js/**', 'server/**/*.js', 'client/modules/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            clientJs: {
                files: ['client/modules/**/*.js', 'client/js/**/*.js'],
                tasks: ['uglify', 'concat'],
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
            },
            karma: {
                files: ['client/**/*.js', 'test/unit/**/*.js'],
                tasks: ['karma:unit:run']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    // grunt-sass is better as it uses libsass, unfortunately it is buggy
    // on linux and I need to wait until it uses version 2.x of node-sass
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.option('force', true);

    grunt.registerTask('default', ['jshint', 'concurrent:default', 'karma']);
    grunt.registerTask('serve', ['concurrent:serve']);
    grunt.registerTask('debug', ['jshint', 'concurrent:debug']);
    grunt.registerTask('init', ['sass', 'jade', 'uglify', 'concat']);
    grunt.registerTask('partials', ['jade']);
    grunt.registerTask('lint', ['jshint']);
};
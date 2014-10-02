module.exports = function(config) {
    config.set({
        basePath: '../',
        files: [
            'client/lib/angular/angular.js',
            'client/lib/angular-mocks/angular-mocks.js',
            'client/lib/angular-messages/angular-messages.js',
            'client/lib/angular-resource/angular-resource.js',
            'client/lib/angular-ui-router/release/angular-ui-router.js',
            'client/js/**/*.js',
            'client/modules/**/*-module.js',
            'client/modules/**/*.js',
            'test/unit/**/*.js'
        ],
        autoWatch: false,
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine'
        ]
    })
}
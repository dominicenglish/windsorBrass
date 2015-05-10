(function() {
    'use strict';

    angular.module('windsor', ['duScroll', 'ngResource', 'ngAnimate', 'ui.router', 'ngTouch', 'windsor.template', 'windsor.event', 'google-maps', 'windsor.config', 'windsor.geocode', 'windsor.about', 'windsor.contact']);

    angular.module('windsor')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'TemplateProvider', function($stateProvider, $urlRouterProvider, $locationProvider, TemplateProvider) {

        // Set HTML5 mode
        $locationProvider
            .html5Mode(true)
            .hashPrefix('!');

        // For any unmatched url, rediret to index
        $urlRouterProvider.otherwise('/');

        var templates = {
            home: '/modules/home/home.html',
            about: '/modules/about/about.html',
            agenda: '/modules/event/agenda.html',
            event: '/modules/event/event.html',
            contact: '/modules/contact/contact.html'
        };

        // Set up states
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: templates.home
            })
            .state('about', {
                url: '/about',
                templateUrl: templates.about
            })
            .state('event', {
                abstract: true,
                url: '/events',
                template: '<div ui-view class="u-fullHeight" ng-class="animationClass"></div>',
                controller: 'EventController'
            })
            .state('event.list', {
                url: '',
                templateUrl: templates.agenda
            })
            .state('event.view', {
                url: '/:id',
                templateUrl: templates.event
            })
            .state('contact', {
                url: '/contact',
                templateUrl: templates.contact
            })
        ;

        TemplateProvider.preloadTemplates(templates);
    }])

    .controller('MainController', ['$scope', 'Event', 'Template', function($scope, Event, Template) {
        Template.preload();
        Event.getEvents();
    }])
    ;

}());
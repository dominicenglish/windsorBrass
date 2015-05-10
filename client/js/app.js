(function() {
    'use strict';

    angular.module('windsor', ['duScroll', 'ngResource', 'ngAnimate', 'ui.router', 'ngTouch', 'windsor.event', 'google-maps', 'windsor.config', 'windsor.geocode', 'windsor.about', 'windsor.contact']);

    angular.module('windsor')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

        // Set HTML5 mode
        $locationProvider
            .html5Mode(true)
            .hashPrefix('!');

        // For any unmatched url, rediret to index
        $urlRouterProvider.otherwise('/');

        // Set up states
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/modules/home/home.html'
            })
            .state('about', {
                url: '/about',
                templateUrl: '/modules/about/about.html'
            })
            .state('event', {
                abstract: true,
                url: '/events',
                template: '<div ui-view class="u-fullHeight" ng-class="animationClass"></div>',
                controller: 'EventController'
            })
            .state('event.list', {
                url: '',
                templateUrl: '/modules/event/agenda.html'
            })
            .state('event.view', {
                url: '/:id',
                templateUrl: '/modules/event/event.html'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: '/modules/contact/contact.html'
            })
        ;
    }])

    .controller('MainController', ['$scope', 'Event', function($scope, Event) {
        Event.getEvents();
    }])
    ;

}());
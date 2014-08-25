angular.module('windsor', ['duScroll', 'ngResource', 'ngAnimate', 'ui.router', 'ngTouch', 'windsor.event', 'google-maps', 'windsor.geocode', 'windsor.about', 'windsor.contact']);
angular.module('windsor.event', []);
angular.module('windsor.geocode', []);
angular.module('windsor.about', []);
angular.module('windsor.contact', []);


angular.module('windsor')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

    // Set HTML5 mode
    $locationProvider
        .html5Mode(true)
        .hashPrefix("!");

    // For any unmatched url, rediret to index
    $urlRouterProvider.otherwise("/");

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

.constant('GoogleApiKey', 'AIzaSyCA_lBJD_eqsxjQ22fFHkGu8zTW8xTu3Fc')

.factory('ViewportService', [function() {
    var currentViewportHeight;
    return {
        setViewportHeight: function(height) {
            currentViewportHeight = height;
        },
        getViewportHeight: function() {
            return currentViewportHeight;
        }
    };
}])

.controller('MainController', ['$scope', 'Event', function($scope, Event) {
    Event.getEvents();
}])

.directive('fullHeight', ['$window', 'ViewportService', function($window, ViewportService) {
    return {
        link: function(scope, element, attrs) {


            var getViewportHeight = function() {
                return Math.max($window.document.documentElement.clientHeight, $window.innerHeight || 0);
            };

            var setElementHeight = function(height) {
                console.log('height changed');
                element.css('height', height+'px');
                ViewportService.setViewportHeight(height);
            };

            var heightChanged = function() {
                setElementHeight(getViewportHeight());
            };

            angular.element($window).on('resize', function(event) {
                if ($window.document.activeElement.tagName === 'BODY') {
                    // Ignore mobile resizes
                    if ($window.innerWidth >= 768) {
                        heightChanged();
                    }
                }
            });

            heightChanged();
        }
    };
}])



.factory('ScrollPointService', [function() {
    var scrollPoints = {};
    var scrollDistances = [];
    var sortDistances = function() {
        scrollDistances.sort(function(a, b) {
            return a - b;
        });
    };
    return {
        setScrollPoint: function(name, distance) {
            scrollPoints[name] = distance;
            scrollDistances.push(distance);
            sortDistances();
        },
        getScrollPoint: function(name) {
            return scrollPoints[name] || 0;
        },
        getNextScrollPoint: function(currentScrollPosition) {
            var i;
            for (i=0; i < scrollDistances.length; i++) {
                if (scrollDistances[i] > currentScrollPosition) {
                    return scrollDistances[i];
                }
            }
            return 0;
        }
    };
}])

.directive('scrollPosition', ['ScrollPointService', '$window', function(ScrollPointService, $window) {
    return {
        scope: {name: '@scrollPosition'},
        link: function(scope, element, attrs) {

            // Find the distance from the top of the document
            var findPosition = function(element) {
                var currentTop = 0;
                if (element.offsetParent) {
                    do {
                        currentTop += element.offsetTop;
                    } while ((element = element.offsetParent));
                    return currentTop;
                }
            };

            var setScrollPosition = function() {
                var distance = findPosition(element[0]);
                ScrollPointService.setScrollPoint(scope.name, distance);
            };

            angular.element($window).on('resize', function(event) {
                if ($window.document.activeElement.tagName === 'BODY') {
                    // Ignore mobile resizes
                    // if ($window.innerWidth >= 768) {
                    //     heightChanged();
                    // }
                    setScrollPosition();
                }
            });

            setScrollPosition();
        }
    };
}])

.directive('scrollTo', ['ScrollPointService', '$document', function(ScrollPointService, $document) {
    return {
        scope: {scrollTo: '@'},
        link: function(scope, element, attrs) {
            element.on('click', function(event) {
                var nextPosition;
                if (scope.scrollTo) {
                    nextPosition = ScrollPointService.getScrollPoint(scope.scrollTo);
                } else {
                    var currentScrollPosition = window.scrollY;
                    nextPosition = ScrollPointService.getNextScrollPoint(currentScrollPosition);
                }
                $document.scrollTo(0, nextPosition, 200);
            });
        }
    };
}])

.directive('scrollToNextScrollPoint', ['ScrollPointService', '$document', function(ScrollPointService, $document) {
    return {
        link: function(scope, element, attrs) {
            element.on('click', function(event) {
                var currentScrollPosition = window.scrollY;
                var nextPosition = ScrollPointService.getNextScrollPoint(currentScrollPosition);
                $document.scrollTo(0, nextPosition, 200);
            });
        }
    };
}])
;
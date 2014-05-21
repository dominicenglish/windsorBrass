angular.module('windsor', ['duScroll', 'ngResource'])

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

.factory('EventResource', ['$resource', function($resource) {
    var calendarId = 'ausbrass.com_7ff0icqnt45drrqqtun4eojl08@group.calendar.google.com';
    return $resource(
        'https://www.googleapis.com/calendar/v3/calendars/:calendarId/events',
        {calendarId: calendarId}
    );
}])

.controller('MainController', ['$scope', 'EventResource', function($scope, EventResource) {
    $scope.getEvents = function() {
        EventResource.get()
        .$promise.then(function(events) {
            $scope.events = events;
        });
    };
    $scope.getEvents();
}])

.directive('fullHeight', ['$window', 'ViewportService', function($window, ViewportService) {
    return {
        link: function(scope, element, attrs) {


            var getViewportHeight = function() {
                return Math.max($window.document.documentElement.clientHeight, $window.innerHeight || 0);
            };

            var setElementHeight = function(height) {
                element.css('height', height+'px');
                ViewportService.setViewportHeight(height);
            };

            var heightChanged = function() {
                setElementHeight(getViewportHeight());
            };

            angular.element($window).on('resize', function(event) {
                if ($window.document.activeElement.tagName === 'BODY') {
                    heightChanged();
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

            var distance = findPosition(element[0]);

            ScrollPointService.setScrollPoint(scope.name, distance);
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
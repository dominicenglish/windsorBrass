angular.module('windsor.event')

.controller('EventController', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {
    /**
     * Note that this event is only triggered for the ENTERING page. This means
     * that the EXITING page will keep the incorrect animation class from the
     * previous animation. This problem can be solved with the following css
     * rules.
     *
     * // A slide-from-right.ng-leave following a slide-from-left.ng-enter is incorrect
     * // and we need to make it behave like a slide-from-left and exit it to the right
     * .slide-from-left.ng-enter ~ .slide-from-right.ng-leave.ng-leave-active {
     *     left: 100%
     * }
     *
     * // // A slide-from-left.ng-leave following a slide-from-right.ng-enter is incorrect
     * // and we need to make it behave like a slide-from-right and exit it to the left
     * .slide-from-right.ng-enter ~ .slide-from-left.ng-leave.ng-leave-active {
     *     left: -100%;
     * }
     */
    $scope.animationClass = 'slide-from-right';
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (fromState.name === 'event.list' && toState.name === 'event.view') {
            $scope.animationClass = 'slide-from-right';
        } else if (fromState.name === 'event.view' && toState.name === 'event.list') {
            $scope.animationClass = 'slide-from-left';
        }
    });
}])

.controller('AgendaController', ['$scope', '$state', 'Event', function($scope, $state, Event) {
    Event.getEvents().then(function(events) {
        $scope.events = events;
    });

    $scope.showEvent = function(event) {
        $state.go('event.view', {'id': event.id});
    }
}])

.controller('EventViewController', ['$scope', '$state', 'Event', 'GeocodeResource', function($scope, $state, Event, GeocodeResource) {
    $scope.dateFormat = "EEEE MMMM d 'at' h:mma";
    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 14,
        options: {
            panControl: false,
            mapTypeControl: false,
            streetViewControl: false
        }
    };
    $scope.marker = {
        id: 'main',
        coordinates: {}
    }

    Event.getEvent($state.params.id)
        .then(function(event) {
            $scope.event = event;
            $scope.map.center.latitude = event.coordinates.latitude;
            $scope.map.center.longitude = event.coordinates.longitude;
            $scope.marker.coordinates = event.coordinates;
        });
}])
;
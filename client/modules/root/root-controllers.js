(function() {
    'use strict';

    angular.module('windsor.root')

    .controller('RootController', ['$scope', 'Event', 'Page', function($scope, Event, Page) {

        $scope.Page = Page;
        // Prefetch all events before we need them on the events page
        Event.getEvents();
    }])
    ;
}());
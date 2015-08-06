(function() {
    'use strict';

    angular.module('windsor.about')

    .controller('AboutController', ['$scope', 'Page', function($scope, Page) {
        Page.setTitleDescription('About Us');
        Page.setDescription('Windsor Brass has become well known around Brisbane for its many park performances, traditional marches and crowd-pleasing favourites.');

        $scope.map = {
            center: {
                latitude: -27.426871,
                longitude: 153.032517
            },
            zoom: 15,
            options: {
                disableDefaultUI: true
            }
        };
        $scope.marker = {
            id: 'band-hall',
            coordinates: {
                latitude: -27.426871,
                longitude: 153.032517
            }
        };
    }])
    ;
}());
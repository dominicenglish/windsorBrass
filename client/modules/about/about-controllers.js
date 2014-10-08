angular.module('windsor.about')

.controller('AboutController', ['$scope', function($scope) {
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
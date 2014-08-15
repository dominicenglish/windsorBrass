angular.module('windsor.contact')

.controller('ContactController', ['$scope', 'MessageTransport', function($scope, MessageTransport) {
    $scope.sender = {name: 'Dom', email: 'dominic.b.english@gmail.com', message: 'hello there'};
    $scope.response = {completed: false, message: ''};
    $scope.sendMessage = function() {
        if ($scope.sender.message) {
            $scope.success = false;
            $scope.error = false;
            MessageTransport.email($scope.sender).$promise
                .then(function(response) {
                    $scope.response.completed = true;
                    $scope.response.message = "Your message was successfully sent";
                    $scope.sender = {};
                })
                .catch(function(response) {
                    $scope.response.completed = true;
                    $scope.response.message = "Something has gone wrong. Your message was not sent";
                });
        }
    }
}])
;
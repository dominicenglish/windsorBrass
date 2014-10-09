(function() {
    'use strict';

    angular.module('windsor.contact')

    .controller('ContactController', ['$scope', 'MessageTransport', function($scope, MessageTransport) {
        $scope.contactForm = {displayErrors: {}};
        $scope.sender = {};
        $scope.sendMessage = function() {
            $scope.contactForm.displayErrors = $scope.contactForm.$error;
            if (!$scope.sender.message) {
                $scope.contactForm.$setDirty();
                angular.forEach($scope.contactForm.$error, function(errorType){
                    angular.forEach(errorType, function(field) {
                        // Set fields to dirty
                        field.$setViewValue(field.$viewValue);
                    });
                });
                return;
            }
            // Wipe any form errors
            $scope.contactForm.displayErrors = {};
            return MessageTransport.email($scope.sender).$promise
                .then(function() {
                    $scope.contactForm.displayErrors.serverSuccess = true;
                    $scope.sender = {};
                })
                .catch(function() {
                    $scope.contactForm.displayErrors.serverError = true;
                });
        };
    }])
    ;
}());
(function() {
    'use strict';

    describe('contact-controllers', function() {
        beforeEach(module('windsor.contact'));

        describe('ContactController', function() {
            var $rootScope,
                $scope,
                createController,
                MessageTransport,
                deferredMessageData;

            beforeEach(function() {

                // Mock controller dependencies
                module(function($provide) {
                    $provide.value('MessageTransport', {email: function(){}});
                });

                inject(function(_$rootScope_, $controller, $q, _MessageTransport_) {
                    $rootScope = _$rootScope_;
                    MessageTransport = _MessageTransport_;
                    $scope = $rootScope.$new();
                    createController = function() {
                        return $controller('ContactController', {$scope: $scope});
                    };

                    deferredMessageData = $q.defer();
                    spyOn(MessageTransport, 'email').and.returnValue({$promise: deferredMessageData.promise});
                });
            });

            describe('sendMessage', function() {
                it('should not send if a message was not provided', function() {

                    createController();
                    // Set form field to invalid value
                    $scope.sender.message = false;
                    // Mock $setDirty method to avoid undefined function
                    $scope.contactForm.$setDirty = function() {};
                    $scope.sendMessage();
                    expect(MessageTransport.email).not.toHaveBeenCalled();
                });

                it('should set the form and all fields to dirty if a message was not provided', function() {

                    createController();
                    // Set form field to invalid value
                    $scope.sender.message = false;

                    // Create observable mock $setViewValue function to test setDirty behaviour
                    var mockSetViewValue = jasmine.createSpy(mockSetViewValue);
                    // Set mock errors
                    $scope.contactForm.$error = {
                        required: [
                            {$setViewValue: mockSetViewValue, $viewValue: 1},
                            {$setViewValue: mockSetViewValue, $viewValue: 2}
                        ],
                        email: [
                            {$setViewValue: mockSetViewValue, $viewValue: 3}
                        ]
                    };

                    // Mock $setDirty method to avoid undefined function
                    $scope.contactForm.$setDirty = function() {};
                    // Need to intercept $setDirty method
                    spyOn($scope.contactForm, '$setDirty');

                    $scope.sendMessage();
                    expect($scope.contactForm.$setDirty).toHaveBeenCalled();
                    expect(mockSetViewValue.calls.count()).toBe(3);
                });

                it('should send the data to the server if form is valid', function() {
                    createController();
                    // Ensure form is valid
                    $scope.sender.message = 'hello';
                    $scope.sendMessage();
                    expect(MessageTransport.email).toHaveBeenCalledWith($scope.sender);
                });

                it('should activate the serverSuccess message if response is successful', function(done) {

                    createController();
                    // Ensure form is valid
                    $scope.sender.message = 'hello';
                    $scope.sendMessage();
                    deferredMessageData.resolve({});
                    deferredMessageData.promise
                        .then(function() {
                            expect($scope.contactForm.displayErrors.serverSuccess).toBe(true);
                            done();
                        });
                    $rootScope.$digest();
                });

                it('should wipe the form data if response is successful', function(done) {
                    createController();
                    // Ensure form is valid
                    $scope.sender.message = 'hello';
                    $scope.sendMessage();
                    deferredMessageData.resolve({});
                    deferredMessageData.promise
                        .then(function() {
                            expect($scope.sender).toEqual({});
                            done();
                        });
                    $rootScope.$digest();
                });

                it('should activate the serverError message if response fails', function(done) {

                    createController();
                    // Ensure form is valid
                    $scope.sender.message = 'hello';
                    var promise = $scope.sendMessage();

                    promise
                        .then(function() {
                            expect($scope.contactForm.displayErrors.serverError).toBe(true);
                            done();
                        });
                    deferredMessageData.reject('reason');
                    $rootScope.$digest();
                });
            });
        });
    });
}());
(function() {
    'use strict';

    describe('contact-services', function() {
        beforeEach(module('windsor.contact'));

        describe('MessageTransport', function() {
            var $rootScope,
                $httpBackend,
                MessageTransport;

            beforeEach(function() {
                inject(function(_$rootScope_, _$httpBackend_, _MessageTransport_) {
                    $rootScope = _$rootScope_;
                    $httpBackend = _$httpBackend_;
                    MessageTransport = _MessageTransport_;
                    $httpBackend.whenPOST('/api/message').respond();
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should contain an `email` method', function() {
                expect(angular.isFunction(MessageTransport.email)).toBe(true);
            });

            it('email method should return an object with a $promise property', function() {
                var response = MessageTransport.email();
                $httpBackend.flush();
                expect(response.$promise).toBeDefined();
            });

            it('returned $promise property should be a valid promise', function(done) {
                $httpBackend.whenPOST('/api/message').respond('hello');
                var response = MessageTransport.email();
                var promise = response.$promise
                    .then(function(res) {
                        expect(res).toBeDefined();
                        setTimeout(done, 0);
                    });
                expect(angular.isFunction(promise.then)).toBe(true);
                expect(angular.isFunction(promise.finally)).toBe(true);
                expect(angular.isFunction(promise.catch)).toBe(true);
                $httpBackend.flush();
                $rootScope.$digest();
            });

            it('email should make a post request to `/api/message`', function() {
                var testData = {test: 'data'};
                $httpBackend.expectPOST('/api/message', testData).respond();
                MessageTransport.email(testData);
                $httpBackend.flush();
            });

            it('email method should return data if request is successful', function(done) {
                var testResponse = {test: 'response'};
                $httpBackend.expectPOST('/api/message').respond(testResponse);
                MessageTransport.email().$promise
                    .then(function(val) {
                        expect(val.test).toBe('response');
                        setTimeout(done, 0);
                    });
                $httpBackend.flush();
            });

            it('email method should reject promise if request fails', function(done) {
                $httpBackend.expectPOST('/api/message').respond(404);
                MessageTransport.email().$promise
                    .catch(function(result) {
                        expect(result.status).toBe(404);
                        setTimeout(done, 0);
                    });
                $httpBackend.flush();
            });
        });
    });
}());
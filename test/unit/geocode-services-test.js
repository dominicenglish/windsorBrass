(function() {
    'use strict';

    describe('geocode-services', function() {

        beforeEach(module('windsor.geocode'));

        describe('GeocodeResource', function() {
            var GeocodeResource,
                GoogleApiKey,
                $httpBackend,
                fakeGeocodeAddress,
                expectedUrl,
                urlTemplate;

            fakeGeocodeAddress = 'Shalom Performing arts Centre, Shalom College campus, 9 Fitzgerald St, Bundaberg QLD, Australia';

            GoogleApiKey = 'Ab_123456789';
            urlTemplate = /https:\/\/maps\.googleapis\.com\/maps\/api\/geocode\/json\?address=[\w\s,\+]*&key=[\w]*/;
            expectedUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+fakeGeocodeAddress.replace(/\s/g, '+')+'&key='+GoogleApiKey;

            beforeEach(function() {
                module(function($provide) {
                    $provide.constant('GoogleApiKey', GoogleApiKey);
                });

                inject(function(_$httpBackend_, _GeocodeResource_) {
                    // Set up mock server
                    $httpBackend = _$httpBackend_;
                    GeocodeResource = _GeocodeResource_;
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('Should contain a geocodeAddress method', function() {
                expect(angular.isFunction(GeocodeResource)).toBe(true);
            });

            it('geocodeAddress should make a get request', function() {
                $httpBackend.expectGET(urlTemplate).respond();
                GeocodeResource.geocodeAddress({address:fakeGeocodeAddress});
                $httpBackend.flush();
            });

            it('geocodeAddress should invoke the request with the right parameters', function() {
                $httpBackend.expectGET(expectedUrl).respond();
                GeocodeResource.geocodeAddress({address:fakeGeocodeAddress});
                $httpBackend.flush();
            });

            it('should return an object with a $promise property', function() {
                $httpBackend.when('GET', urlTemplate).respond();
                var response = GeocodeResource.geocodeAddress({address:fakeGeocodeAddress});
                $httpBackend.flush();
                expect(response.$promise).toBeDefined();
            });

            it('returned $promise property should be a valid promise', function() {
                $httpBackend.when('GET', urlTemplate).respond();
                var response = GeocodeResource.geocodeAddress({address:fakeGeocodeAddress});
                $httpBackend.flush();
                expect(angular.isFunction(response.$promise.then)).toBe(true);
                expect(angular.isFunction(response.$promise.finally)).toBe(true);
                expect(angular.isFunction(response.$promise.catch)).toBe(true);
            });

            it('should return a rejected promise if connection fails', function(done) {
                $httpBackend.expectGET(urlTemplate).respond(401, '');
                var response = GeocodeResource.geocodeAddress({address:fakeGeocodeAddress});

                response.$promise
                    .catch(function(reason) {
                        expect(reason).toBeDefined();
                        setTimeout(done, 0);
                    });
                $httpBackend.flush();
            });
        });
    });
}());
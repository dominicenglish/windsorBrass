describe('geocode-services', function() {

    beforeEach(module('windsor.geocode'));

    describe('GeocodeResource', function() {
        var GeocodeResource,
            GoogleApiKey,
            $httpBackend,
            userRequestHandler,
            fakeGeocodeAddress,
            expectedUrl;

        fakeGeocodeAddress = 'Shalom Performing arts Centre, Shalom College campus, 9 Fitzgerald St, Bundaberg QLD, Australia';

        GoogleApiKey = 'Ab_123456789';
        expectedUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+fakeGeocodeAddress.replace(/\s/g, '+')+'&key='+GoogleApiKey;

        beforeEach(function($provide) {
            module(function($provide) {
                $provide.constant('GoogleApiKey', GoogleApiKey);
            });

            inject(function(_$httpBackend_, _GeocodeResource_) {
                // Set up mock server
                $httpBackend = _$httpBackend_;
                GeocodeResource = _GeocodeResource_;
            })
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('Should contain a geocodeAddress method', function() {
            expect(angular.isFunction(GeocodeResource)).toBe(true);
        });

        it('geocodeAddress should make a get request', function() {
            var regex = /https:\/\/maps\.googleapis\.com\/maps\/api\/geocode\/json\?address=[\w\s,\+]*&key=[\w]*/;
            $httpBackend.expectGET(regex).respond();
            var response = GeocodeResource.geocodeAddress({address:fakeGeocodeAddress});
            $httpBackend.flush();
        });

        it('geocodeAddress should invoke the request with the right parameters', function() {
            $httpBackend.expectGET(expectedUrl).respond();
            var response = GeocodeResource.geocodeAddress({address:fakeGeocodeAddress});
            $httpBackend.flush();
        });
    });
});
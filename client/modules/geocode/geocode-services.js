angular.module('windsor.geocode')

.factory('GeocodeResource', ['$resource', 'GoogleApiKey', function($resource, GoogleApiKey) {

    return $resource(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
            key: GoogleApiKey,
            address: '@address'
        },
        {
            geocodeAddress: {
                method: 'GET',
                cache: true
            }
        }
    );
}])
;
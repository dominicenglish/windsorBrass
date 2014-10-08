angular.module('windsor.contact')

.factory('MessageTransport', ['$resource', function($resource) {
    return $resource(
        '/api/message',
        {},
        {
            email: {
                method: 'POST'
            }
        }
    );
}]);
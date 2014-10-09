(function() {
    'use strict';

    angular.module('windsor.event')

    .factory('EventResource', ['$resource', 'GoogleApiKey', 'GoogleCalendarId', function($resource, GoogleApiKey, GoogleCalendarId) {
        var occursAfter = new Date();
        return $resource(
            'https://www.googleapis.com/calendar/v3/calendars/:calendarId/events',
            {
                calendarId: GoogleCalendarId,
                key: GoogleApiKey,
                timeMin: occursAfter.toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            }
        );
    }])

    .factory('NewsletterResource', ['$resource', function($resource) {
        return $resource(
            '/api/newsletter/:action',
            {},
            {
                // Should accept an object with {email: ''}
                subscribe: {
                    method: 'POST',
                    params: {
                        action: 'subscribe'
                    }
                }
            }
        );
    }])

    .factory('Event', ['EventResource', '$q', 'GeocodeResource', function(EventResource, $q, GeocodeResource) {
        var futureEvents;
        var activeEvent;

        var getFutureEvents = function() {
            if (!futureEvents) {
                // Assign a semi-promise
                futureEvents = EventResource.get().$promise;
            }
            return futureEvents;
        };

        var findEventById = function(id) {
            var deferred = $q.defer();

            if (activeEvent && activeEvent.id === id) {
                deferred.resolve(activeEvent);
            }
            getFutureEvents()
                .then(function(events) {
                    angular.forEach(events.items, function(event) {
                        if (event.id === id) {
                            activeEvent = event;
                            deferred.resolve(event);
                        }
                    });
                    deferred.reject('Not a valid event id');
                })
                .catch(function(reason) {
                    deferred.reject(reason);
                });

            return deferred.promise;
        };

        var geocodeAddress = function(event) {
            return GeocodeResource.geocodeAddress({address: event.location}).$promise
                .then(function(response) {
                    event.coordinates = {};
                    event.coordinates.latitude = response.results[0].geometry.location.lat;
                    event.coordinates.longitude = response.results[0].geometry.location.lng;
                    return event;
                });
        };

        return {
            getEvents: function() {
                return getFutureEvents();
            },
            getEvent: function(id) {
                return findEventById(id)
                    .then(function(event) {
                        return geocodeAddress(event);
                    });
            }
        };
    }])
    ;
}());
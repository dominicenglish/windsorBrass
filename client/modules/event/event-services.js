angular.module('windsor.event')

.factory('EventResource', ['$resource', 'GoogleApiKey', function($resource, GoogleApiKey) {
    var calendarId = 'ausbrass.com_7ff0icqnt45drrqqtun4eojl08@group.calendar.google.com';
    var occursAfter = new Date();
    return $resource(
        'https://www.googleapis.com/calendar/v3/calendars/:calendarId/events',
        {
            calendarId: calendarId,
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
            subscribe: {
                method: 'POST',
                params: {
                    action: 'subscribe',
                    email: ''
                }
            }
        }
    );
}])

.factory('Event', ['EventResource', '$q', 'GeocodeResource', function(EventResource, $q, GeocodeResource) {
    var futureEvents = undefined;
    var activeEvent = undefined;

    var getFutureEvents = function() {
        if (!futureEvents) {
            // Assign a semi-promise
            futureEvents = EventResource.get().$promise;
        }
        return futureEvents;
    }

    var findEventById = function(id) {
        console.log('findEventById');
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
                })
                deferred.reject('Not a valid event id');
            });

        return deferred.promise;
    }

    return {
        getEvents: function() {
            return getFutureEvents();
        },
        getEvent: function(id) {
            return findEventById(id)
                .then(function(event) {
                    return GeocodeResource.geocodeAddress({address: event.location}).$promise
                        .then(function(response) {
                            event.coordinates = {};
                            event.coordinates.latitude = response.results[0].geometry.location.lat;
                            event.coordinates.longitude = response.results[0].geometry.location.lng;
                            return event;
                        })
                });
        },
        geocodeAddress: function(address) {

        }
    }
}])
;
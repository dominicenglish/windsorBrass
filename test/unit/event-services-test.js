(function() {
    'use strict';

    describe('event-service', function() {

        beforeEach(module('windsor.event'));

        describe('EventResource', function() {
            var $httpBackend,
                EventResource,
                GoogleApiKey,
                GoogleCalendarId,
                fakeTime,
                urlTemplate,
                expectedUrl;


            urlTemplate = /https:\/\/www\.googleapis\.com\/calendar\/v3\/calendars\/[\w\.@]+\/events[\w&=]*/;
            GoogleApiKey = 'Ab_123456789';
            GoogleCalendarId = 'ab.c1@d';
            fakeTime = (new Date()).toISOString();
            expectedUrl = 'https://www.googleapis.com/calendar/v3/calendars/'+GoogleCalendarId+'/events?key='+GoogleApiKey+'&orderBy=startTime&singleEvents=true&timeMin='+fakeTime;

            beforeEach(function() {
                module(function($provide) {
                    $provide.constant('GoogleApiKey', GoogleApiKey);
                    $provide.constant('GoogleCalendarId', GoogleCalendarId);
                });
                inject(function(_$httpBackend_, _EventResource_) {
                    $httpBackend = _$httpBackend_;
                    EventResource = _EventResource_;
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should make GET requests', function() {
                $httpBackend.expectGET(urlTemplate).respond();
                EventResource.get();
                $httpBackend.flush();
            });

            it('should make GET requests with correct properties', function() {
                $httpBackend.expectGET(expectedUrl).respond();
                EventResource.get({timeMin: fakeTime});
                $httpBackend.flush();
            });

            it('should return an object with a $promise property', function() {
                $httpBackend.when('GET', urlTemplate).respond();
                var response = EventResource.get();
                $httpBackend.flush();
                expect(response.$promise).toBeDefined();
            });

            it('returned $promise property should be a valid promise', function() {
                $httpBackend.when('GET', urlTemplate).respond();
                var response = EventResource.get();
                $httpBackend.flush();
                expect(angular.isFunction(response.$promise.then)).toBe(true);
                expect(angular.isFunction(response.$promise.finally)).toBe(true);
                expect(angular.isFunction(response.$promise.catch)).toBe(true);
            });
        });

        describe('NewsletterResource', function() {
            var $httpBackend,
                NewsletterResource,
                expectedUrl;

            expectedUrl = '/api/newsletter/subscribe';

            beforeEach(inject(function(_$httpBackend_, _NewsletterResource_) {
                $httpBackend = _$httpBackend_;
                NewsletterResource = _NewsletterResource_;
            }));

            it('should contain a subscribe method', function() {
                expect(angular.isFunction(NewsletterResource.subscribe)).toBe(true);
            });

            it('should make a POST request', function() {
                $httpBackend.expectPOST(expectedUrl).respond();
                NewsletterResource.subscribe();
                $httpBackend.flush();
            });

            it('should make a POST request with correct data', function() {
                $httpBackend.expectPOST(
                    expectedUrl,
                    {email: 'a@a.com'}
                ).respond();
                NewsletterResource.subscribe({email: 'a@a.com'});
                $httpBackend.flush();
            });

            it('should return an object with a $promise property', function() {
                $httpBackend.when('POST', expectedUrl).respond();
                var response = NewsletterResource.subscribe();
                $httpBackend.flush();
                expect(response.$promise).toBeDefined();
            });

            it('returned $promise property should be a valid promise', function() {
                $httpBackend.when('POST', expectedUrl).respond();
                var response = NewsletterResource.subscribe();
                $httpBackend.flush();
                expect(angular.isFunction(response.$promise.then)).toBe(true);
                expect(angular.isFunction(response.$promise.finally)).toBe(true);
                expect(angular.isFunction(response.$promise.catch)).toBe(true);
            });
        });

        describe('Event', function() {
            var Event,
                $rootScope,
                MockGeocodeResource,
                MockEventResource,
                mockGeocodeData,
                mockEventData,
                deferredEventData,
                deferredGeocodeData;

            mockGeocodeData = {
                'results' : [
                    {
                        'address_components' : [
                            {
                                'long_name' : '9',
                                'short_name' : '9',
                                'types' : [ 'street_number' ]
                            },
                            {
                                'long_name' : 'Fitzgerald Street',
                                'short_name' : 'Fitzgerald St',
                                'types' : [ 'route' ]
                            },
                            {
                                'long_name' : 'Norville',
                                'short_name' : 'Norville',
                                'types' : [ 'locality', 'political' ]
                            },
                            {
                                'long_name' : 'Queensland',
                                'short_name' : 'QLD',
                                'types' : [ 'administrative_area_level_1', 'political' ]
                            },
                            {
                                'long_name' : 'Australia',
                                'short_name' : 'AU',
                                'types' : [ 'country', 'political' ]
                            },
                            {
                                'long_name' : '4670',
                                'short_name' : '4670',
                                'types' : [ 'postal_code' ]
                            }
                        ],
                        'formatted_address' : '9 Fitzgerald Street, Norville QLD 4670, Australia',
                        'geometry' : {
                            'location' : {
                                'lat' : -24.895447,
                                'lng' : 152.340771
                            },
                            'location_type' : 'ROOFTOP',
                            'viewport' : {
                                'northeast' : {
                                    'lat' : -24.89409801970849,
                                    'lng' : 152.3421199802915
                                },
                                'southwest' : {
                                    'lat' : -24.8967959802915,
                                    'lng' : 152.3394220197085
                                }
                            }
                        },
                        'partial_match' : true,
                        'types' : [ 'street_address' ]
                    }
                ],
                'status' : 'OK'
            };
            mockEventData = {
                'kind': 'calendar#events',
                'etag': '\'1412084224774000\'',
                'summary': 'Upcoming Events',
                'description': 'A list of upcoming events for Excelsior and Windsor Brass',
                'updated': '2014-09-30T13:37:04.774Z',
                'timeZone': 'Australia/Brisbane',
                'accessRole': 'reader',
                'defaultReminders': [],
                'items': [
                    {
                        'kind': 'calendar#event',
                        'etag': '\'2817867735004000\'',
                        'id': 'c66i3qqrpe0j4n8e98ahhqdd9s',
                        'status': 'confirmed',
                        'htmlLink': 'https://www.google.com/calendar/event?eid=YzY2aTNxcXJwZTBqNG44ZTk4YWhocWRkOXMgYXVzYnJhc3MuY29tXzdmZjBpY3FudDQ1ZHJycXF0dW40ZW9qbDA4QGc',
                        'created': '2014-07-23T03:09:56.000Z',
                        'updated': '2014-08-25T02:31:07.502Z',
                        'summary': 'Brass in Bundy - Public Workshop',
                        'description': 'Brisbane Excelsior Band and Bundaberg Municipal band present - Brass in Bundy.\n\nCome join the Cream of Australian musical talent in a fun filled public workshop. If you have ever wanted to toot on a tuba or play with a trombone, now is your chance to unleash your inner musical talent. For the more experienced players, time to get some Pro tips from the best. Planned to be fun and educational suitable for all ages 10+.\n\nDon\'t miss out on the Gala Concert that evening from 7pm!\n\nWorkshop bookings can be made at the following address: https://register.eventarc.com/25617/brass-in-bundy-public-workshop',
                        'location': 'Shalom Performing arts Centre, Shalom College campus, 9 Fitzgerald St, Bundaberg QLD, Australia',
                        'creator': {
                            'email': 'dominic.b.english@gmail.com',
                            'displayName': 'Dominic English'
                        },
                        'organizer': {
                            'email': 'ausbrass.com_7ff0icqnt45drrqqtun4eojl08@group.calendar.google.com',
                            'displayName': 'Upcoming Events',
                            'self': true
                        },
                        'start': {
                            'dateTime': '2014-10-04T14:00:00+10:00'
                        },
                        'end': {
                            'dateTime': '2014-10-04T16:00:00+10:00'
                        },
                        'iCalUID': 'c66i3qqrpe0j4n8e98ahhqdd9s@google.com',
                        'sequence': 0
                    },
                    {
                        'kind': 'calendar#event',
                        'etag': '\'2817867853604000\'',
                        'id': 'mrarjcdqqto1ae32lrcknsi8lo',
                        'status': 'confirmed',
                        'htmlLink': 'https://www.google.com/calendar/event?eid=bXJhcmpjZHFxdG8xYWUzMmxyY2tuc2k4bG8gYXVzYnJhc3MuY29tXzdmZjBpY3FudDQ1ZHJycXF0dW40ZW9qbDA4QGc',
                        'created': '2014-07-23T03:13:17.000Z',
                        'updated': '2014-08-25T02:32:06.802Z',
                        'summary': 'Brass in Bundy - Gala Concert',
                        'description': 'Brisbane Excelsior Band and Bundaberg Municipal band present - Brass in Bundy.\n\nCome and listen in Awe at the awesome power of Brass! Australia’s Top Brass Band have been invited to showcase their talent in a Concert not to be missed. If you have ever liked brass music or the movie “Brassed Off” you will be spellbound as you are immersed in the Best Brass music you can hear in Australia!\n\n$32 - Adult Tickets\n$28 - Student/Concession Tickets\n\nConcert tickets can be purchased at the following address: https://register.eventarc.com/25616/brass-in-bundy',
                        'location': 'Shalom Performing arts Centre, Shalom College campus, 9 Fitzgerald St, Bundaberg QLD, Australia',
                        'creator': {
                            'email': 'dominic.b.english@gmail.com',
                            'displayName': 'Dominic English'
                        },
                        'organizer': {
                            'email': 'ausbrass.com_7ff0icqnt45drrqqtun4eojl08@group.calendar.google.com',
                            'displayName': 'Upcoming Events',
                            'self': true
                        },
                        'start': {
                            'dateTime': '2014-10-04T19:00:00+10:00'
                        },
                        'end': {
                            'dateTime': '2014-10-04T21:00:00+10:00'
                        },
                        'iCalUID': 'mrarjcdqqto1ae32lrcknsi8lo@google.com',
                        'sequence': 0
                    },
                    {
                        'kind': 'calendar#event',
                        'etag': '\'2820160815902000\'',
                        'id': 'rsuadpfdt4hrr1os8g5ujpc1bc',
                        'status': 'confirmed',
                        'htmlLink': 'https://www.google.com/calendar/event?eid=cnN1YWRwZmR0NGhycjFvczhnNXVqcGMxYmMgYXVzYnJhc3MuY29tXzdmZjBpY3FudDQ1ZHJycXF0dW40ZW9qbDA4QGc',
                        'created': '2014-08-02T05:48:37.000Z',
                        'updated': '2014-09-07T09:00:07.951Z',
                        'summary': 'Brass Rocks',
                        'description': 'Enjoy a sunny day at Roma St Parklands! To find us, simply follow the sounds of 60s, 70s and 80s pop classics to the amphitheatre.\n',
                        'location': 'Roma Street Parkland Amphitheatre, Wickham Terrace, Spring Hill',
                        'creator': {
                            'email': 'administrator@ausbrass.com',
                            'displayName': 'Google Apps Administrator'
                        },
                        'organizer': {
                            'email': 'ausbrass.com_7ff0icqnt45drrqqtun4eojl08@group.calendar.google.com',
                            'displayName': 'Upcoming Events',
                            'self': true
                        },
                        'start': {
                            'dateTime': '2014-10-05T14:00:00+10:00'
                        },
                        'end': {
                            'dateTime': '2014-10-05T15:00:00+10:00'
                        },
                        'transparency': 'transparent',
                        'iCalUID': 'rsuadpfdt4hrr1os8g5ujpc1bc@google.com',
                        'sequence': 1,
                        'hangoutLink': 'https://plus.google.com/hangouts/_/calendar/YXVzYnJhc3MuY29tXzdmZjBpY3FudDQ1ZHJycXF0dW40ZW9qbDA4QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20.rsuadpfdt4hrr1os8g5ujpc1bc'
                    },
                    {
                        'kind': 'calendar#event',
                        'etag': '\'2817175356012000\'',
                        'id': '1p77s9uda60ocjauchvfn4lmr8',
                        'status': 'confirmed',
                        'updated': '2014-08-21T02:21:18.006Z',
                        'start': {
                            'dateTime': '2014-10-23T19:00:00+10:00'
                        },
                        'end': {
                            'dateTime': '2014-10-23T21:00:00+10:00'
                        },
                        'visibility': 'private',
                        'iCalUID': '1p77s9uda60ocjauchvfn4lmr8@google.com'
                    },
                    {
                        'kind': 'calendar#event',
                        'etag': '\'2813917837134000\'',
                        'id': 'gj47p5rv91jesij58melrr5cn4',
                        'status': 'confirmed',
                        'htmlLink': 'https://www.google.com/calendar/event?eid=Z2o0N3A1cnY5MWplc2lqNThtZWxycjVjbjQgYXVzYnJhc3MuY29tXzdmZjBpY3FudDQ1ZHJycXF0dW40ZW9qbDA4QGc',
                        'created': '2014-08-02T05:51:19.000Z',
                        'updated': '2014-08-02T05:55:18.567Z',
                        'summary': 'Summer Wonderland',
                        'description': 'Windsor Brass will be under the story bridge from 2pm, Sunday the 2nd of November playing one of our favourites - theme songs! Track us down at Captain Burke Park, Holman Street, Kangaroo Point for some entertaining tunes. ',
                        'location': 'Captain Burke Park, Holman St, Kangaroo Point QLD, Australia',
                        'creator': {
                            'email': 'administrator@ausbrass.com',
                            'displayName': 'Google Apps Administrator'
                        },
                        'organizer': {
                            'email': 'ausbrass.com_7ff0icqnt45drrqqtun4eojl08@group.calendar.google.com',
                            'displayName': 'Upcoming Events',
                            'self': true
                        },
                        'start': {
                            'dateTime': '2014-11-02T14:00:00+10:00'
                        },
                        'end': {
                            'dateTime': '2014-11-02T15:00:00+10:00'
                        },
                        'iCalUID': 'gj47p5rv91jesij58melrr5cn4@google.com',
                        'sequence': 0,
                        'hangoutLink': 'https://plus.google.com/hangouts/_/calendar/YXVzYnJhc3MuY29tXzdmZjBpY3FudDQ1ZHJycXF0dW40ZW9qbDA4QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20.gj47p5rv91jesij58melrr5cn4'
                    }
                ]
            };

            var resolve = function(deferred, value) {
                deferred.resolve(value);
                $rootScope.$digest();
            };

            var reject = function(deferred, reason) {
                deferred.reject(reason);
                $rootScope.$digest();
            };

            beforeEach(function() {

                module(function($provide) {

                    MockEventResource = function() {
                        return {
                            get: function() {}
                        };
                    };

                    MockGeocodeResource = function() {
                        return {
                            geocodeAddress: function(){}
                        };
                    };

                    $provide.factory('EventResource', MockEventResource);
                    $provide.factory('GeocodeResource', MockGeocodeResource);
                });

                inject(function(_Event_, EventResource, GeocodeResource, $q, _$rootScope_) {
                    Event = _Event_;
                    $rootScope = _$rootScope_;

                    deferredEventData = $q.defer();
                    spyOn(EventResource, 'get').and.returnValue({$promise: deferredEventData.promise});

                    deferredGeocodeData = $q.defer();
                    spyOn(GeocodeResource, 'geocodeAddress').and.returnValue({$promise: deferredGeocodeData.promise});
                });

            });

            describe('getEvents', function() {
                it('should return an object', function(done) {
                    Event.getEvents()
                        .then(function(events) {
                            expect(angular.isObject(events)).toBe(true);
                            expect(angular.isArray(events)).toBe(false);
                            done();
                        });
                    resolve(deferredEventData, mockEventData);
                });
                it('should return the mock events object', function(done) {
                    Event.getEvents()
                        .then(function(events) {
                            expect(events).toEqual(mockEventData);
                            done();
                        });
                    resolve(deferredEventData, mockEventData);
                });
                it('should return a rejected promise if request fails', function(done) {
                    Event.getEvents()
                        .catch(function(reason) {
                            expect(reason).toEqual('broken');
                            done();
                        });
                    reject(deferredEventData, 'broken');
                });
            });

            describe('getEvent', function() {
                it('should return an object', function(done) {
                    Event.getEvent('mrarjcdqqto1ae32lrcknsi8lo')
                        .then(function(event) {
                            expect(angular.isObject(event)).toBe(true);
                            expect(angular.isArray(event)).toBe(false);
                            done();
                        });
                    resolve(deferredEventData, mockEventData);
                    resolve(deferredGeocodeData, mockGeocodeData);
                });
                it('should return the correct event', function(done) {
                    Event.getEvent('mrarjcdqqto1ae32lrcknsi8lo')
                        .then(function(event) {
                            expect(event).toEqual(mockEventData.items[1]);
                            done();
                        });
                    resolve(deferredEventData, mockEventData);
                    resolve(deferredGeocodeData, mockGeocodeData);
                });
                it('should return an object with coordinates attached', function(done) {
                    Event.getEvent('mrarjcdqqto1ae32lrcknsi8lo')
                        .then(function(event) {
                            expect(event.coordinates).toBeDefined();
                            expect(event.coordinates.latitude).toBe(-24.895447);
                            expect(event.coordinates.longitude).toBe(152.340771);
                            done();
                        });
                    resolve(deferredEventData, mockEventData);
                    resolve(deferredGeocodeData, mockGeocodeData);
                });
                it('should return a rejected promise if resource fails', function(done) {
                    Event.getEvent('mrarjcdqqto1ae32lrcknsi8lo')
                        .catch(function(reason) {
                            expect(reason).toEqual('broken');
                            done();
                        });
                    reject(deferredEventData, 'broken');
                });
                it('should return a rejected promise if event doesnt exist', function(done) {
                    Event.getEvent('nonExistentId')
                        .catch(function(reason) {
                            expect(reason).toBeTruthy();
                            done();
                        });
                    resolve(deferredEventData, mockEventData);
                });
            });
        });
    });
}());
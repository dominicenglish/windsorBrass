(function() {
    'use strict';

    describe('event-controllers', function() {
        beforeEach(module('windsor.event'));

        describe('EventController', function() {
            var $rootScope,
                $scope,
                createController;
            beforeEach(function() {
                inject(function($controller, _$rootScope_) {
                    $rootScope = _$rootScope_;
                    $scope = $rootScope.$new();
                    createController = function() {
                        return $controller('EventController', {'$scope': $scope});
                    };
                });
            });

            it('should change animation class to `slide-from-right` when coming from event.list', function() {

                spyOn($rootScope, '$on').and.callFake(function(events, callback) {
                    var toState = {name: 'event.view'};
                    var fromState = {name: 'event.list'};
                    callback({}, toState, {}, fromState, {});
                });
                createController();
                expect($scope.animationClass).toBe('slide-from-right');
            });

            it('should change animation class to `slide-from-left` when changing to event.list', function() {

                spyOn($rootScope, '$on').and.callFake(function(events, callback) {
                    var toState = {name: 'event.list'};
                    var fromState = {name: 'event.view'};
                    callback({}, toState, {}, fromState, {});
                });
                createController();
                expect($scope.animationClass).toBe('slide-from-left');
            });
        });

        describe('AgendaController', function() {
            var $rootScope,
                $scope,
                createController,
                deferredEventData,
                deferredSubscriptionData;
            beforeEach(function() {

                module(function($provide) {
                    var mockState = {
                        go: function() {}
                    };
                    var mockEvent = {
                        getEvents: function() {
                            return {then: function(){}};
                        }
                    };
                    var mockNewsletterResource = {
                        subscribe: function() {}
                    };
                    $provide.value('$state', mockState);
                    $provide.value('Event', mockEvent);
                    $provide.value('NewsletterResource', mockNewsletterResource);
                });

                inject(function($controller, _$rootScope_, Event, NewsletterResource, $q) {
                    $rootScope = _$rootScope_;
                    $scope = $rootScope.$new();

                    createController = function() {
                        return $controller('AgendaController', {$scope: $scope});
                    };

                    deferredEventData = $q.defer();
                    spyOn(Event, 'getEvents').and.returnValue(deferredEventData.promise);

                    deferredSubscriptionData = $q.defer();
                    spyOn(NewsletterResource, 'subscribe').and.returnValue({$promise: deferredSubscriptionData.promise});
                });
            });

            it('should populate events upon controller instantiation', function() {
                createController();
                var fakeEventArray = [
                    {name: 'event1'},
                    {name: 'event2'}
                ];
                deferredEventData.resolve(fakeEventArray);
                $rootScope.$digest();

                expect($scope.events).toEqual(fakeEventArray);
            });

            it('showEvent(event) should change state to event.view with the provided id', inject(function($state) {

                spyOn($state, 'go').and.callFake(function(route, data) {
                    expect(route).toBe('event.view');
                    expect(data.id).toBe('fakeId');
                });
                createController();
                var fakeEvent = {id: 'fakeId'};
                $scope.showEvent(fakeEvent);
            }));


            it('should not subscribe if the form is invalid', inject(function(NewsletterResource) {
                createController();
                $scope.subscriptionForm.$invalid = true;
                $scope.subscribe();
                expect(NewsletterResource.subscribe).not.toHaveBeenCalled();
            }));

            it('should attempt subscription if valid form', inject(function(NewsletterResource) {
                createController();
                $scope.user.email = 'dominic.b.english@gmail.com';
                $scope.subscribe();
                expect(NewsletterResource.subscribe).toHaveBeenCalledWith({email: 'dominic.b.english@gmail.com'});
            }));


            it('should set serverSuccess message on successful subscription', function(done) {
                createController();
                $scope.subscribe()
                    .then(function() {
                        expect($scope.subscriptionForm.displayErrors.serverSuccess).toBe(true);
                        done();
                    });
                deferredSubscriptionData.resolve(true);
                $rootScope.$digest();
            });

            it('should wipe the form email value on successful subscription', function(done) {
                createController();
                $scope.subscribe()
                    .then(function() {
                        expect($scope.user.email).toBe('');
                        done();
                    });
                deferredSubscriptionData.resolve(true);
                $rootScope.$digest();
            });

            it('should activate serverError message if subscription fails', function(done) {
                createController();
                $scope.subscribe()
                    .then(function() {
                        expect($scope.subscriptionForm.displayErrors.serverError).toBe(true);
                        done();
                    });
                deferredSubscriptionData.reject({data: {code: 301}});
                $rootScope.$digest();
            });

            it('should activate alreadySubscribed message if request returns 214 error', function(done) {
                createController();
                $scope.subscribe()
                    .then(function() {
                        expect($scope.subscriptionForm.displayErrors.serverError).toBe(true);
                        expect($scope.subscriptionForm.displayErrors.alreadySubscribed).toBe(true);
                        done();
                    });
                deferredSubscriptionData.reject({data: {code: 214}});
                $rootScope.$digest();
            });
        });

        describe('EventViewController', function() {
            var $rootScope,
                $scope,
                Event,
                deferredEventData,
                mockEventData,
                createController;

            mockEventData = {
                coordinates: {
                    latitude: -27.4645395,
                    longitude: 153.0370224
                }
            };

            beforeEach(function() {

                // Mock controller dependencies
                module(function($provide) {
                    $provide.value('Event', {getEvent: function(){}});
                    $provide.value('$state', {params: {id: 'testId'}});
                });

                inject(function(_$rootScope_, $q, _Event_, $controller){
                    $rootScope = _$rootScope_;
                    $scope = $rootScope.$new();
                    Event = _Event_;
                    // Create custom deferred for manual promise resolving
                    deferredEventData = $q.defer();
                    // Calls to Event.getEvent() will return our promise instead
                    spyOn(Event, 'getEvent').and.returnValue(deferredEventData.promise);
                    // Need delayed controller instantiation in case of spys in tests
                    createController = function() {
                        return $controller('EventViewController', {$scope: $scope});
                    };
                });
            });

            it('should make an event request on load', function() {
                createController();
                expect(Event.getEvent).toHaveBeenCalled();
            });

            it('should populate $scope.event on load', function(done) {
                createController();
                deferredEventData.resolve(mockEventData);
                deferredEventData.promise
                    .then(function() {
                        expect($scope.event).toEqual(mockEventData);
                        done();
                    });
                $rootScope.$digest();
            });

            it('should populate $scope.marker.coordinates on load', function(done) {
                createController();
                deferredEventData.resolve(mockEventData);
                deferredEventData.promise
                    .then(function() {
                        expect($scope.marker.coordinates).toEqual(mockEventData.coordinates);
                        done();
                    });
                $rootScope.$digest();
            });

            it('should populate $scope.map.center coordinates on load', function(done) {
                createController();
                deferredEventData.resolve(mockEventData);
                deferredEventData.promise
                    .then(function() {
                        expect($scope.map.center).toEqual(mockEventData.coordinates);
                        done();
                    });
                $rootScope.$digest();
            });
        });
    });
}());
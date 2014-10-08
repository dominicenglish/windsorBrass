describe('config-services', function() {
    beforeEach(module('windsor.config'));

    describe('GoogleApiKey', function() {
        var GoogleApiKey;

        beforeEach(inject(function(_GoogleApiKey_) {
            GoogleApiKey = _GoogleApiKey_;
        }));

        it('should return a valid google API key', function() {
            expect(GoogleApiKey).toMatch(/^[\w]+$/);
        });
    });

    describe('GoogleCalendarId', function() {
        var GoogleCalendarId;

        beforeEach(inject(function(_GoogleCalendarId_) {
            GoogleCalendarId = _GoogleCalendarId_;
        }));

        it('should return a valid google calendar id', function() {
            expect(GoogleCalendarId).toMatch(/^[\w\.@]+$/);
        });
    });
});
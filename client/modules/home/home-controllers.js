(function() {
    'use strict';

    angular.module('windsor.home')

    .controller('HomeController', ['Page', function(Page) {
        Page.setTitleDescription("brass band in Brisbane");
        Page.setDescription("Windsor Brass is a community brass band in Brisbane Australia");
    }]);
}());
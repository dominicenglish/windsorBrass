(function() {
    'use strict';

    angular.module('windsor.root')

    .factory('Page', [function() {

        var page = {
            title: 'Windsor Brass Band',
            description: 'Windsor Brass is a community brass band in Brisbane Australia.',
        };

        return {
            getTitle: function() {
                return page.title;
            },
            setTitle: function(title) {
                page.title = title;
            },
            setTitleDescription: function(titleDescription) {
                page.title = 'Windsor Brass - ' + titleDescription;
            },
            getDescription: function() {
                return page.description;
            },
            setDescription: function(description) {
                page.description = description;
            }
        };
    }])
    ;
}());
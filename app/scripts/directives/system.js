'use strict';

angular.module('shoplyApp').directive('pageTitle', pageTitle);

function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title
                var title = 'Shoply';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'Shoply | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};
(function () {
    'use strict';

    angular.module('crm').run(run);

    /** @ngInject */
    function run($rootScope, $state, authService, webSocketService, $window, $timeout) {

        var timer = 0;
        var ONE_SECOND = 1000;
        var TIME_TO_LIVE = 30 * 60 * 1000;
        $window.addEventListener('click', function () {
            timer = 0;
        });
        authService.getAuthStatus().then(authService.restore,
            function () {
                if (event && event.preventDefault) {
                    event.preventDefault();
                }
                $state.go('login');
            });

        var callback = $rootScope.$on('$stateChangeStart', listenRouteChange);

        $rootScope.$on('$destroy', callback);

        function listenRouteChange(event, next) {
            if (next.name == 'home') {
                event.preventDefault();
                if (authService.isAuthenticated()) {
                    webSocketService.connect();
                    $state.go(authService.isAdmin() ? 'users.list' : 'dashboards');
                } else {
                    $state.go('login');
                }
            }
        }

        var timeUp = function () {
            timer += ONE_SECOND;
            if (timer == TIME_TO_LIVE) {
                authService.logout();
                $state.go('login');
            }
            $timeout(timeUp, ONE_SECOND);
        };
        $timeout(timeUp(), ONE_SECOND);
    }
})();

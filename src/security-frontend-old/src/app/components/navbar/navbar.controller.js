(function () {
    'use strict';

    angular
        .module('crm.navbar')
        .controller('AppController', navBarController);

    function navBarController(authService, $state, $location, $cookies, $rootScope, webSocketService, searchService) {
        var vm = this;

        vm.isAdmin = authService.isAdmin;
        vm.isManager = authService.isManager;
        vm.isSpecialist = authService.isSpecialist;
        vm.isActive = isActive;
        vm.isLoggedUser = isLoggedUser;
        vm.getUserName = authService.getUserName;
        vm.getContactName = authService.getContactName;
        vm.getCountUnreadComments = authService.getCountUnreadComments;
        vm.isShowCountUnreadComments = isShowCountUnreadComments;
        vm.setCountUnreadComments = authService.setCountUnreadComments;
        vm.getContactId = authService.getContactId;
        vm.showUnreadComments = searchService.showUnreadComments;
        vm.logout = logout;
        $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
            // save the previous state in a rootScope variable so that it's accessible from everywhere
            $rootScope.previousState = from;
            $rootScope.previousStateParams = fromParams;
        });

        function isShowCountUnreadComments() {
            return (authService.getCountUnreadComments() != null) && (authService.getCountUnreadComments() != 0);
        }
        function isActive(path) {
            return $location.path().substr(0, path.length) === path;
        }

        function isLoggedUser() {
            return authService.isAuthenticated();
        }

        function logout() {
            authService.logout()
                .finally(function () {
                        clearLinkedInAccountCookies();
                        webSocketService.disconnect();
                        $state.go('login');
                    }
                );
        }

        function clearLinkedInAccountCookies() {
            $cookies.put('linkedInCookies', '');
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('crm')
        .controller('LoginController', LoginController);

    function LoginController($state, authService, webSocketService) {
        var vm = this;

        vm.login = function () {
            authService.login(vm.username, vm.password, vm.rememberMe).then(goToHomePage).catch(showError);
        };

        function goToHomePage() {
            webSocketService.connect();
            $state.go(authService.isAdmin() ? 'users.list' : 'dashboards');
        }

        function showError() {
            vm.error = 'Invalid login or password';
        }
    }
})();

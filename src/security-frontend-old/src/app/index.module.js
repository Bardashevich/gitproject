(function () {
    'use strict';

    angular
        .module('crm', [
            'crm.core',
            'crm.user',
            'crm.role',
            'crm.group',
            'crm.contact',
            'crm.company',
            'crm.task',
            'crm.vacancy',
            'crm.dashboard',
            'crm.navbar',
            'crm.footer']);

    angular
        .module('crm.core', [
            'ngResource',
            'ngCookies',
            'ui.router',
            'ui.bootstrap',
            'ui.select',
            'blockUI',
            'ngSanitize',
            'bd.sockjs',
            'AngularStompDK'
        ]);
})();

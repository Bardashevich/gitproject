(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .directive('crmVacancyGeneralInfo', crmVacancyGeneralInfo);

    /** @ngInject */
    function crmVacancyGeneralInfo() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/vacancy/directive/general-info/crm-vacancy-general-info.html',
            scope: false
        };
    }
})();

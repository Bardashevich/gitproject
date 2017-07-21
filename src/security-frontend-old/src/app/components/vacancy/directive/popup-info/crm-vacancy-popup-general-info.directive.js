(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .directive('crmVacancyPopupGeneralInfo', crmVacancyPopupGeneralInfo);

    /** @ngInject */
    function crmVacancyPopupGeneralInfo() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/vacancy/directive/popup-info/crm-vacancy-popup-general-info.html',
            controller: 'VacancyEditController',
            controllerAs: 'vacancyCtrl'
        };
    }
})();

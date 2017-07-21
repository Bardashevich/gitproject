(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .directive('crmVacancyTableHeader', crmVacancyTableHeader);

    /** @ngInject */
    function crmVacancyTableHeader() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/vacancy/directive/skills/skill-table-header/skill-table-header.html',
            scope: {
                addingFunction: '=',
                removingFunction: '=',
                vm: '=',
                title: '@'
            }
        };
    }
})();

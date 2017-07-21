(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .directive('crmVacancySkills', crmVacancySkills);

    /** @ngInject */
    function crmVacancySkills() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/vacancy/directive/skills/crm-vacancy-skills.html',
            scope: {
                vm : '='
            }
        };
    }
})();

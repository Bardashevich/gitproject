(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .directive('crmVacancyOpportunities', crmVacancyOpportunities);

    /** @ngInject */
    function crmVacancyOpportunities() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/vacancy/directive/opportunities/crm-vacancy-opportunities.html',
            controller: 'OpportunityController',
            controllerAs: 'OpportunityWidget',
            scope: {
                vacancy: '='
            }
        };
    }
})();

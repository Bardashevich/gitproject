(function () {
    'use strict';

    angular
        .module('crm.validation')
        .directive('crmDatePeriodValidation', crmDatePeriodValidation);

    /** @ngInject */
    function crmDatePeriodValidation() {
        return {
            restrict:'A',
            require:'^form',
            link: function (scope, element, attributes, form) {
                scope.$watch('vm.isEndDateInvalid', function (value) {
                    form[element.attr('name')].$setValidity('date_period', !value);
                    element.parent().toggleClass('has-error', value);
                    element.parent().toggleClass('ng-invalid', value);
                });
            }
        };
    }
})();

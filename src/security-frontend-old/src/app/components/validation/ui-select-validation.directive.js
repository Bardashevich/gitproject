(function () {
    'use strict';

    angular
        .module('crm.validation')
        .directive('crmUiSelectValidation', crmUiSelectValidation);

    /** @ngInject */
    function crmUiSelectValidation() {
        return {
            restrict: 'A',
            require: '^form',
            link: function (scope, element, attributes, form) {
                scope.$watch(form.$name + '.' + element.attr('name') + '.$dirty', function (newval) {
                    if (newval) {
                        watch();
                    }
                });

                function watch() {
                    scope.$watch(form.$name + '.' + element.attr('name') + '.$invalid', function (value) {
                        element.parent().toggleClass('has-error', value);
                        element.parent().toggleClass('ng-invalid', value);
                    });
                }
            }
        };
    }
})();

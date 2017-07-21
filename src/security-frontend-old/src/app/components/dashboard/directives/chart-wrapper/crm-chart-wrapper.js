(function () {
    'use strict';

    angular
        .module('crm.dashboard')
        .component('crmChartWrapper', crmChartWrapper());

    /** @ngInject */
    function crmChartWrapper() {
        return {
            restrict: 'E',
            transclude: true,
            bindings: {
                panelTitle: '<',
                openButton: '&',
                addButton: '&',
                closeButton: '&',
                panelStyle: '<',
                dashName: '<'
            },
            templateUrl: 'app/components/dashboard/directives/chart-wrapper/crm-chart-wrapper.html'
        };
    }

})();

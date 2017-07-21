(function () {
    'use strict';

    angular
        .module('crm.common')
        .factory('dateService', dateService);

    /** @ngInject */
    function dateService() {
        return {
            getLastDateOfCurrentMonth: getLastDateOfCurrentMonth,
            getFirstDateOfPreviousMonth: getFirstDateOfPreviousMonth,
            getFormattedDate: getFormattedDate,
            getLastDateOfCurrentYear: getLastDateOfCurrentYear,
            getFirstDateOfPreviousYear: getFirstDateOfPreviousYear
        };

        function getLastDateOfCurrentMonth() {
            var date = new Date().setMonth(new Date().getMonth() + 1);
            return new Date(new Date(date).setDate(0));
        }

        function getLastDateOfCurrentYear() {
            var date = new Date().setYear(new Date().getYear() + 1999);
            return new Date(new Date(date).setDate(0));
        }

        function getFirstDateOfPreviousYear() {
            var date = new Date().setYear(new Date().getYear());
            return new Date(new Date(date).setDate(0));
        }

        function getFirstDateOfPreviousMonth(monthsCount) {
            monthsCount = monthsCount || 0;
            var date = new Date().setMonth(new Date().getMonth() - monthsCount);
            return new Date(new Date(date).setDate(1));
        }

        function getFormattedDate(dateObject) {
            if (Object.prototype.toString.call(dateObject) === '[object Date]'){
                return dateObject.toISOString().slice(0, 10);
            } else {
                return '';
            }
        }
    }
})();

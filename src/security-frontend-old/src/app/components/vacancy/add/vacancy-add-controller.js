(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .controller('VacancyAddController', vacancyAddController);

    /** @ngInject */
    function vacancyAddController($log, vacancyDetailsService, authService) {
        var vm = this;
        var IS_VACANCY_NEW = true;
        var MAX_YEAR_FOR_DATE = 10;

        vm.canEdit = true;
        vm.title = 'Create new vacancy';
        vm.submitText = 'Create';
        vm.submit = submit;
        vm.details = vacancyDetailsService;
        vm.cancel = vacancyDetailsService.cancel;
        vm.showDatePicker = showDatePicker;
        vm.endDate = endDate;

        init(vm);

        function endDate(date) {
            var currentDate = new Date(new Date().setYear(new Date().getYear() + 1900)).setMinutes(-10);
            var topDate = new Date(new Date().setYear(new Date().getYear() + 1900 + MAX_YEAR_FOR_DATE));
            if (!(date >= currentDate && date < topDate) && date != null) {
                vm.vacancy.openDate = date.setYear(new Date().getYear() + 1900);
            }
            return true;
        }

        function showDatePicker(scope, datePickerName) {
            scope.isDatePickerVisible[datePickerName] = true;
        }

        function init(context) {
            var currentUsername = authService.getUserName();
            $log.log(currentUsername);
            setDatePickerOptions(context);
            context.vacancy = {id : 0};
            vacancyDetailsService.loadData(context);
        }

        function submit() {
            vacancyDetailsService.submit(vm.vacancy, IS_VACANCY_NEW);
        }

        function setDatePickerOptions(context) {
            context.isDatePickerVisible = {
                openDate : false,
                closeDate : false
            };
            context.datePickerOptions = {
                openDate : {
                    minDate: Date.now(),
                    startingDay : 1
                },
                closeDate : {
                    minDate: Date.now(),
                    startingDay : 1
                }
            };
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .controller('VacancyEditController', vacancyEditController);

    /** @ngInject */
    function vacancyEditController($q, vacancyDetailsService, authService, vacancyService, $stateParams) {
        var vm = this;
        var IS_VACANCY_NEW = false;
        var MAX_YEAR_FOR_DATE = 10;

        vm.canEdit = false;
        vm.title = 'Edit vacancy';
        vm.submitText = 'Save';
        vm.vacancy = {};
        vm.submit = submit;
        vm.submitPopupEditForm = submitPopupEditForm;
        vm.details = vacancyDetailsService;
        vm.cancel = vacancyDetailsService.cancel;
        vm.cancelPopupEditForm = cancelPopupEditForm;
        vm.isManager = authService.isManager;
        vm.isTutor = authService.isTutor;
        vm.showDatePicker = showDatePicker;
        vm.endDate = endDate;

        init(vm);
        loadData(vm);

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
            $q.all(
                [
                    isEditable()
                ]
            ).then(getVacancy)
                .then(seDatePickerOptions(context));
        }

        function loadData(context) {
            vacancyDetailsService.loadData(context);
        }

        function submit() {
            vacancyDetailsService.submit(vm.vacancy, IS_VACANCY_NEW);
        }

        function submitPopupEditForm(parentCtrl) {
            vacancyService.update(vm.vacancy).then(function () {
                parentCtrl.ok();
            });
        }

        function cancelPopupEditForm(parentCtrl) {
            parentCtrl.cancel();
        }

        function isEditable() {
            vm.canEdit = !authService.isTutor();
            // TODO: add some logic?
        }

        function seDatePickerOptions(context) {
            return function () {
                context.isDatePickerVisible = {
                    openDate : false,
                    closeDate : false
                };
                context.datePickerOptions = {
                    openDate : {
                        minDate: Date.now() < context.vacancy.openDate ? Date.now() : context.vacancy.openDate,
                        startingDay : 1
                    },
                    closeDate : {
                        minDate: Date.now() < context.vacancy.openDate ? Date.now() : context.vacancy.openDate,
                        startingDay : 1
                    }
                };
            };
        }

        function getVacancy() {
            return vacancyService.get($stateParams.id).then(function (response) {
                vm.vacancy = response.data;
                if (response.data.vacancySkills.length > 0) {
                    vm.vacancy.countSkills = response.data.vacancySkills.length;
                } else {
                    vm.vacancy.countSkills = null;
                }
            });
        }

    }
})();

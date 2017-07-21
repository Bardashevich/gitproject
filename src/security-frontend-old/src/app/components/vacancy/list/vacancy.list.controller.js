(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .controller('VacancyListController', vacancyListController);

    /** @ngInject */
    function vacancyListController($q, authService, vacancyService, searchService, dateService, dialogService, $state,
                                   contactReportGeneratorService) {
        var vm = this;
        vm.isManager = authService.isManager();
        vm.isTutor = authService.isTutor;
        vm.searchVacancyBundle = searchService.vacancyMode();
        vm.add = add;
        vm.edit = edit;
        vm.remove = remove;
        vm.displayedPeriodChanged = displayedPeriodChanged;
        vm.generateReport = generateReport;

        init();

        function init() {
            vm.searchVacancyBundle.clearItemsList();
            vm.searchVacancyBundle.find();
            vm.displayedPeriods = [
                {
                    index: 0,
                    desc: 'Show for current month',
                    startDate: dateService.getFirstDateOfPreviousMonth()
                }, {
                    index: 1,
                    desc: 'Show for last 2 months',
                    startDate: dateService.getFirstDateOfPreviousMonth(1)
                }, {
                    index: 2,
                    desc: 'Show for last 3 months',
                    startDate: dateService.getFirstDateOfPreviousMonth(2)
                }, {
                    index: 3,
                    desc: 'Show for last 6 months',
                    startDate: dateService.getFirstDateOfPreviousMonth(5)
                }, {
                    index: 4,
                    desc: 'Show for last 12 months',
                    startDate: dateService.getFirstDateOfPreviousMonth(11)
                }, {
                    index: 5,
                    desc: 'Show all vacancy',
                    startDate: dateService.getFirstDateOfPreviousYear()
                }
            ];
            vm.selectedDisplayPeriod = vm.displayedPeriods[1];
        }

        function add() {
            $state.go('vacancies.add');
        }

        function edit(vacancy) {
            $state.go('vacancies.edit', {id: vacancy.id});
        }

        function remove() {
            var checkedVacancies = vm.searchVacancyBundle.itemsList.filter(function (vacancy) {
                return vacancy.checked;
            });
            if (checkedVacancies.length > 0) {
                openRemoveDialog().then(function () {
                    removeVacancies(checkedVacancies);
                });
            }
        }

        function removeVacancies(checkedVacancies) {
            var tasks = [];
            checkedVacancies.forEach(function (vacancy) {
                if (vacancy.checked) {
                    tasks.push(vacancyService.remove(vacancy.id));
                }
            });
            $q.all(tasks).then(vm.searchVacancyBundle.find);
        }

        function openRemoveDialog() {
            return dialogService.confirm('Do you want to delete this vacancy?').result;
        }

        function displayedPeriodChanged(selectedPeriod) {
            vm.searchVacancyBundle.filter.displayedPeriodStart = selectedPeriod.startDate.getTime();
            vm.searchVacancyBundle.filter.displayedPeriodEnd = (selectedPeriod.index != 5) ? dateService.getLastDateOfCurrentMonth().getTime() : dateService.getLastDateOfCurrentYear().getTime();
            vm.searchVacancyBundle.find();
        }

        function generateReport() {
            var filter = {
                showClosed: vm.searchVacancyBundle.isShowClosed,
                displayedPeriodStart: vm.searchVacancyBundle.filter.displayedPeriodStart,
                displayedPeriodEnd: vm.searchVacancyBundle.filter.displayedPeriodEnd
            };
            vacancyService.generateReport(filter).then(function (response) {
                var filePath = response.data;
                var fileType = 'CSV';
                var fileName = 'Vacancies_list.' + fileType;
                contactReportGeneratorService.downloadFile(filePath, fileType, fileName);
            });
        }
    }
})();

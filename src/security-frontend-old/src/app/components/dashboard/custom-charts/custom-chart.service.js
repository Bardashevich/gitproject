(function () {
    'use strict';

    angular
        .module('crm.dashboard')
        .factory('customChartService', customChartService);

    /** @ngInject */
    function customChartService($state) {
        return {
            editVacancy: editVacancy,
            getOpenedVacanciesTable : getOpenedVacanciesTable,
            getManagerOpenedVacanciesTable : getManagerOpenedVacanciesTable,
            getManagerStudentsTable : getManagerStudentsTable,
            getStudentsTable: getStudentsTable
        };

        function getManagerOpenedVacanciesTable() {
            return 'app/components/dashboard/custom-charts/views/manager-opened-vacancies-table.html';
        }

        function getManagerStudentsTable() {
            return 'app/components/dashboard/custom-charts/views/manager-students-table.html';
        }

        function getOpenedVacanciesTable(context) {
            context.openedVacanciesData = context.searchOpenVacancyBundle.itemsList;
            return 'app/components/dashboard/custom-charts/views/opened-vacancies-table.html';
        }

        function getStudentsTable(context) {
            context.studentsData = context.searchStudentBundle.itemsList;
            return 'app/components/dashboard/custom-charts/views/students-table.html';
        }

        function editVacancy(vacancy) {
            $state.go('vacancies.edit', {id: vacancy.id, previousState: 'dashboards'});
        }
    }
})();

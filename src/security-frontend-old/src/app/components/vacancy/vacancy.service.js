(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .factory('vacancyService', vacancyService);

    /** @ngInject */
    function vacancyService($http, $log, dialogService, $stateParams, dateService) {
        return {
            getAll: getAll,
            get: get,
            getById: getById,
            create: create,
            update: update,
            remove: remove,
            find: find,
            findOpportunities: getRecruitmentOpportunitiesRequest,
            updateLastSearchDate: updateLastSearchDate,
            countVacanciesByStatus: countVacanciesByStatus,
            editVacancyPopup : editVacancyPopup,
            generateReport:generateReport
        };

        function getRecruitmentOpportunitiesRequest(filter) {
            return $http.post('rest/getRecruitmentOpportunitiesForVacancy', filter);
        }

        function getAll() {
            var filter = {
                showClosed : true
            };
            return $http.get('rest/vacancies', {params: filter});
        }

        function get(id) {
            return $http.get('rest/vacancies/' + id);
        }

        function getById(id) {
            return $http.get('rest/vacancies/' + id);
        }

        function create(vacancy) {
            return $http.post('rest/vacancies/', vacancy);
        }

        function update(vacancy) {
            return $http.put('rest/vacancies', vacancy);
        }

        function remove(id) {
            return $http.delete('rest/vacancies/' + id);
        }

        function find(filter) {
            return $http.get('rest/vacancies/', {params: filter});
        }

        function updateLastSearchDate(vacancy) {
            return $http.put('rest/vacancies/' + vacancy.id + '/update/date');
        }

        function countVacanciesByStatus(period) {
            var defaultPeriod = {
                start : dateService.getFirstDateOfPreviousMonth(),
                end : dateService.getLastDateOfCurrentMonth()
            };
            period = period || defaultPeriod;
            return $http.get('rest/vacancies/status/count/from/' +
                             period.start.getTime() + '/to/' + period.end.getTime());
        }

        function editVacancyPopup(vacancy) {
            $stateParams.id = vacancy.id;
            openEditDialog(vacancy).then(function (model) {
                $log.log(model);
            });
        }

        function openEditDialog(vacancy) {
            var detailsUrl = 'app/components/vacancy/vacancy.popup.view.html';
            return dialogService.custom(detailsUrl, {
                size: 'lg',
                vacancy: angular.copy(vacancy)
            }).result;
        }

        function generateReport(filter) {
            return $http.post('rest/vacancies/report/generate', filter);
        }
    }
})();

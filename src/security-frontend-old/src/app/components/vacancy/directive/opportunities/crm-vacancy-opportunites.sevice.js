(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .factory('vacancyOpportunitiesService', vacancyOpportunitiesService);
    /** @ngInject */
    function vacancyOpportunitiesService($uibModal, $http, dateService, $q) {

        var vm = this;
        vm.opportunityStatuses = [];
        vm.linkedOpportunityStatusesMap = {};

        return {
            searchInLinkedIn: searchInLinkedIn,
            getRecruitmentOpportunities: getRecruitmentOpportunitiesRequest,
            editVacancyOpportunity: editVacancyOpportunity,
            actionOpportunity: actionOpportunity,
            updateOpportunity: updateOpportunity,
            getOpportunityStatusLogicJSON: getOpportunityStatusLogicJSON,
            getActiveOpportunityStatuses:getActiveOpportunityStatuses,
            getOpportunityStatusById:getOpportunityStatusById,
            getOpportunityStatusesByDate: getOpportunityStatusesByDate,
            getOpportunityStatistics: getOpportunityStatistics
        };

        function openReasonsAndCommentModal(isReasonAllowed, isCommentAllowed) {
            return $uibModal.open({
                templateUrl: 'app/components/vacancy/directive/opportunities/modal/opportunityReasonsView.html',
                controller: 'OpportunityReasonViewController',
                controllerAs: 'vm',
                resolve:{
                    isReasonAllowed: function () {
                        return isReasonAllowed;
                    },
                    isCommentAllowed: function () {
                        return isCommentAllowed;
                    }
                }
            });
        }


        function getActiveOpportunityStatuses(curentStatus) {
            if (!vm.linkedOpportunityStatusesMap[curentStatus]) {
                vm.linkedOpportunityStatusesMap[curentStatus] = generateActiveOpportunityStatuses(curentStatus);
            }
            return vm.linkedOpportunityStatusesMap[curentStatus];
        }

        function generateActiveOpportunityStatuses(status) {
            var activeStatusesArray = [];
            var statusObj = getOpportunityStatusById(status);
            if (statusObj != null) {
                statusObj.linkedStatuses.forEach(function (item) {
                    activeStatusesArray.push(getOpportunityStatusById(item.key));
                });
            }
            return activeStatusesArray;
        }

        function getOpportunityStatusById(id) {
            for (var i = 0; i < vm.opportunityStatuses.length; i++) {
                if (vm.opportunityStatuses[i].id == id) {
                    return vm.opportunityStatuses[i];
                }
            }
        }

        function getOpportunityStatusLogicJSON() {
            return new Promise(function (resolve) {
                getOpportunityStatusLogicJSONRequest().then(function (response) {
                    vm.opportunityStatuses = JSON.parse(response.data);
                    resolve(vm.opportunityStatuses);
                });
            });
        }

        function getOpportunityStatusLogicJSONRequest() {
            return $http.get('rest/getOpportunityStatusLogicJSON');
        }

        function editVacancyOpportunity(opportunity) {
            openOpportunityDetailsForm(opportunity).result.then(function () {}, function () {});
        }

        function openOpportunityDetailsForm(opportunity) {
            return $uibModal.open({
                templateUrl: 'app/components/vacancy/directive/opportunities/opportunity.details.html',
                controller: 'OpportunityEditController',
                controllerAs: 'vm',
                resolve:{
                    opportunity: function () {
                        return opportunity;
                    }
                }
            });
        }

        function searchInLinkedIn(vacancy) {
            return $q(function (resolve, reject) {
                openSearchForm(vacancy)
                    .result.then(
                    function () {
                        resolve();
                    },
                    function () {
                        reject();
                    });
            });
        }

        function getRecruitmentOpportunitiesRequest(filter) {
            return $http.post('rest/getRecruitmentOpportunitiesForVacancy', filter);
        }


        function openSearchForm(vacancy) {
            return $uibModal.open({
                templateUrl: 'app/components/vacancy/search/linkedInSearch.view.html',
                controller: 'LinkedInSearchController',
                controllerAs: 'vm',
                windowClass:'linkedin-search-popup',
                resolve:{
                    vacancy: function () {
                        return vacancy;
                    }
                }
            });
        }

        function updateOpportunity(opportunity) {
            return $q(function (resolve, reject) {
                openReasonsAndCommentModal(isReasonAllowedForStatus(opportunity.currentStatus, opportunity.status),
                                                                    isCommentAllowedForStatus(opportunity.status))
                .result.then(function (result) {
                    var opportunityDto = {
                        id: opportunity.id,
                        status: opportunity.status,
                        reason: isReasonAllowedForStatus(opportunity.currentStatus, opportunity.status) ? result.reason
                                                                                                        : null,
                        comment: isCommentAllowedForStatus(opportunity.status) ? result.comment : null
                    };
                    updateOpportunityStatusRequest(opportunityDto).then(
                        function (result) {
                            resolve(result);
                        },
                        function () {
                            reject();
                        });
                }, function () {
                    resolve();
                });
            });
        }

        function isCommentAllowedForStatus(status) {
            return getOpportunityStatusById(status).isCommentEnabled;
        }

        function isReasonAllowedForStatus(currentStatus, newStatus) {
            var statuses = getOpportunityStatusById(currentStatus).linkedStatuses;
            for (var i = 0; i < statuses.length; i++){
                if (statuses[i].key == newStatus) {
                    return statuses[i].isReasonEnabled;
                }
            }
            return false;
        }

        function actionOpportunity(result, actionId, vacancyId) {
            var opportunityActionData = {
                linkedInSearchResultId: result.id,
                recruitmentOpportunityType: actionId,
                reason: result.reasons,
                vacancyId: vacancyId
            };
            saveOpportunity(opportunityActionData).then(function () {
                result.status = actionId;
            });
        }

        function saveOpportunity(linkedInSearchResult) {
            return $http.post('rest/saveOpportunity', linkedInSearchResult);
        }

        function updateOpportunityStatusRequest(linkedInSearchResult) {
            return $http.post('rest/updateOpportunity', linkedInSearchResult);
        }

        function getOpportunityStatusesByDate(period) {
            var defaultPeriod = {
                start : dateService.getFirstDateOfPreviousMonth(),
                end : dateService.getLastDateOfCurrentMonth()
            };
            period = period || defaultPeriod;
            return $http.get('rest/opportunity/statuses/from/' + period.start.getTime() + '/to/' + period.end.getTime());
        }

        function getOpportunityStatistics(period, vacancyId) {
            var defaultPeriod = {
                start : dateService.getFirstDateOfPreviousMonth(),
                end : dateService.getLastDateOfCurrentMonth()
            };
            period = period || defaultPeriod;

            vacancyId = vacancyId || -1;

            return $http.get('rest//opportunity/statistic/from/' + period.start.getTime() + '/to/' + period.end.getTime() + '/vacancy/' + vacancyId);
        }

    }
})();

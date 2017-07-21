(function () {
    'use strict';
    angular
        .module('crm.vacancy')
        .controller('LinkedInSearchController', LinkedInSearchController);

    /** @ngInject */

    function LinkedInSearchController($http, $uibModalInstance, $cookies, vacancy, vacancyService, vacancyOpportunitiesService) {

        var vm = this;

        vm.submitText = 'Search';
        vm.title = 'LinkedIn Search';
        vm.searchResult = [];
        vm.nextLink = '';
        vm.vacancy = vacancy;
        vm.linkedInAccount = {};
        vm.linkedInCookiesStr = getLinkedInAccountCookiesStr();
        vm.linkedInAuthentificationMessage = '';
        vm.logInLogOutLinkedIn = logInLogOutLinkedIn;
        vm.linkedInSearch = {vacancyId: vacancy.id, keyWords: getSkills()};
        vm.getActiveOpportunityStatuses = vacancyOpportunitiesService.getActiveOpportunityStatuses;
        vm.actionOpportunity = vacancyOpportunitiesService.actionOpportunity;
        vm.actionOptions = [
            {id: 'ACCEPT', name: 'Accept'},
            {id: 'REJECT', name: 'Reject'}
        ];
        vm.locations = [
            {id: 'ru', name: 'Russia'},
            {id: 'by', name: 'Belarus'},
            {id: 'us', name: 'USA'}
        ];
        vm.selectedLocation = {};
        vm.searchBtn = search;
        vm.searchNext = searchNext;

        function getSkills() {
            var skillsStr = '';
            var countRequired = 0;
            if (vm.vacancy.vacancySkills) {
                for (var i = 0; i < vm.vacancy.vacancySkills.length; i++) {
                    if (vm.vacancy.vacancySkills[i].required) {
                        skillsStr += vm.vacancy.vacancySkills[i].name + ' ';
                        countRequired += 1;
                    }
                }
            }
            if (countRequired == 0) {
                for (var i = 0; i < vm.vacancy.vacancySkills.length; i++) {
                        skillsStr += vm.vacancy.vacancySkills[i].name + ' ';
                }
            }
            return skillsStr.trim();
        }

        function logInLogOutLinkedIn() {
            if (vm.linkedInCookiesStr) {
                vm.linkedInCookiesStr = '';
                saveLinkedInAccountCookies('');
            } else {
                authenticatLinkedInAccount();
            }
        }

        function authenticatLinkedInAccount() {

            getLinkedInAccountCookies(vm.linkedInAccount).then(function (response) {
                if (response.data.errorMsg) {
                    vm.linkedInCookiesStr = '';
                    vm.linkedInAuthentificationMessage = response.data.errorMsg;
                } else {
                    var cookiesStr = JSON.stringify(response.data);
                    saveLinkedInAccountCookies(cookiesStr);
                    vm.linkedInCookiesStr = cookiesStr;
                    vm.linkedInAuthentificationMessage = '';
                }
            });
        }

        function saveLinkedInAccountCookies(value) {
            $cookies.put('linkedInCookies', value);
        }

        function getLinkedInAccountCookiesStr() {
            var str = $cookies.get('linkedInCookies');
            return !str || str == '""' ? '' : str;
        }

        function getLinkedInAccountCookies(linkedInAccount) {
            return $http.post('rest/getLinkedInCookies', linkedInAccount);
        }

        function seacrhRequest(searchData) {
            return $http.post('rest/searchLinkedInContacts', searchData);
        }

        function seacrhNextRequest(searchData) {
            return $http.post('rest/searchNextLinkedInContacs', searchData);
        }

        function search() {
            if (vm.linkedInCookiesStr) {
                vm.linkedInSearch.location = vm.selectedLocation.id;
                vm.linkedInSearch.cookiesStr = vm.linkedInCookiesStr;
                return seacrhRequest(vm.linkedInSearch).then(function (response) {
                    vm.searchResult = response.data.contacts;
                    vm.nextLink = response.data.nextLink;
                    vacancyService.updateLastSearchDate(vm.vacancy).then(function (response) {
                        vm.vacancy.lastSearchDate = response.data;
                    });
                    if (response.data.contacts.length < 6 && !!vm.nextLink) {
                        searchNext();
                    }
                    if (!vm.isScrollActive) {
                        $('#linkedin-search-result-container').slimScroll(
                            {
                                height: '600px'
                            }
                        );
                        vm.isScrollActive = true;
                    }
                });
            }
        }

        function searchNext() {
            var searchNextObject = {nextLink: vm.nextLink, vacancyId: vm.vacancy.id, cookiesStr: vm.linkedInCookiesStr};
            return seacrhNextRequest(searchNextObject).then(function (response) {
                vm.searchResult = vm.searchResult.concat(response.data.contacts);
                vm.nextLink = response.data.nextLink;
                if (response.data.contacts.length < 6 && !!vm.nextLink) {
                    searchNext();
                }
            });
        }

        vm.cancel = function () {
            $uibModalInstance.close();
        };

    }

})();

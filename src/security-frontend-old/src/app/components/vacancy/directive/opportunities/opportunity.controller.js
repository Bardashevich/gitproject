(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .controller('OpportunityController', opportunityController);

    /** @ngInject */
    function opportunityController(searchService, vacancyOpportunitiesService, $state, contactSecurityService, dialogService, FileUploader, MAX_FILE_SIZE,
                                   $scope, $window, $http) {
        var vm = this;

        vm.searchOpportunityBundle = searchService.opportunitiesMode();
        vm.opportunities = {};
        vm.vacancy = $scope.vacancy;
        vm.searchInLinkedIn = searchInLinkedIn;
        vm.openLinkedInProfile = openLinkedInProfile;
        vm.reloadOpportunities = loadRecruitmentOpportunities;
        vm.actionOpportunity = actionOpportunity;
        vm.openContact = openContact;
        vm.getOpportunityStatusById = vacancyOpportunitiesService.getOpportunityStatusById;
        vm.opportunitiesActionStatus = [];
        vm.getActiveOpportunityStatuses = vacancyOpportunitiesService.getActiveOpportunityStatuses;
        vm.uploadCVDialog = uploadCVDialog;

        getOpportunityStatusLogic();


        function getOpportunityStatusLogic() {
            vacancyOpportunitiesService.getOpportunityStatusLogicJSON().then(function (statuses) {
                vm.opportunitiesActionStatus = statuses;
                vm.opportunitiesStatus = vm.getOpportunityStatusById('CONSIDER');
                loadRecruitmentOpportunities();
            });
        }

        function searchInLinkedIn() {
            vacancyOpportunitiesService.searchInLinkedIn(vm.vacancy).then(function () {
                loadRecruitmentOpportunities();
            });
        }

        function openContact(contactId) {
            if (contactId) {
                contactSecurityService.checkReadPermission(contactId).then(function () {
                    $state.go('contacts.edit', {id: contactId});
                });
            }
        }

        function loadRecruitmentOpportunities() {
            vm.searchOpportunityBundle.filter.vacancyId = vm.vacancy.id ? vm.vacancy.id : 0;
            vm.searchOpportunityBundle.filter.status = vm.opportunitiesStatus ? vm.opportunitiesStatus.id : 'CONSIDER';
            vm.searchOpportunityBundle.find();
        }

        function openLinkedInProfile(profileLink) {
            openLinkInNewTab(profileLink);
        }

        function openLinkInNewTab(link) {
            var win = $window.open(link, '_blank');
            win.focus();
        }

        function actionOpportunity(opportunity, status) {
            opportunity.currentStatus = opportunity.status;
            opportunity.status = status.id;
            opportunity.vacancyId = vm.vacancy.id;
            vacancyOpportunitiesService.updateOpportunity(opportunity).then(
                function (result) {
                    result && result.data && removeOpportunityFromArray(opportunity);
                }
            );
        }

        function removeOpportunityFromArray(opportunity) {
            for (var i = 0; i < vm.searchOpportunityBundle.itemsList.length; i++) {
                if (vm.searchOpportunityBundle.itemsList[i].id == opportunity.id) {
                    vm.searchOpportunityBundle.itemsList.splice(i, 1);
                }
            }
        }

        function uploadCVDialog() {
            var uploader = getCVFileUploader();
            return dialogService.custom('app/components/vacancy/directive/opportunities/cv/upload.cv.view.html', {
                title: 'Upload CV',
                size: 'modal--user-table',
                cancelTitle: 'Cancel',
                okTitle: 'Upload',
                loadFile: vm.loadFile,
                refresh: function () {
                   loadRecruitmentOpportunities();
                },
                uploader: uploader,
                attachment: uploader.tempFile
            }).result;
        }

        function getCVFileUploader() {
            return new FileUploader(
                {
                    tempFile: {},
                    withCredentials: true,
                    url: 'rest/parse/contact/cv/' + vm.vacancy.id + '/',
                    onAfterAddingFile: function (item) {
                        vm.loadFile = null;
                        if (item._file.size < MAX_FILE_SIZE) {
                            this.tempFile.name = item._file.name;
                            this.uploadItem(item);
                            vm.loadFile = true;
                        } else {
                            dialogService.notify('File size is too large. It should not exceed 100MB');
                            this.clearQueue();
                        }
                    },
                    onErrorItem: function (item, response) {
                        dialogService.error('File hasn\'t been uploaded because error happened: ' + response.message);
                        this.clearQueue();
                    },
                    onSuccessItem: function (item, response) {
                        this.tempFile.filePath = response;
                    }
                });
        }
    }
})();

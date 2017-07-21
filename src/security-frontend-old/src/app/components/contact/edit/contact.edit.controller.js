(function () {
    'use strict';

    angular
        .module('crm.contact')
        .controller('contactEditController', contactEditController);

    /** @ngInject */
    function contactEditController($q, contactDetailsService, contactSecurityService, authService, contactService,
                                    $stateParams, contactCommentsService) {
        var vm = this;

        vm.TEN_YEARS_LATER = 10;
        vm.TEN_YEARS_AGO = -10;
        vm.FIFTY_YEARS_AGO = -50;
        vm.NINETY_YEARS_AGO = -90;

        vm.newComment = '';
        vm.addComment = addComment;
        vm.canEdit = false;
        vm.contact = contactDetailsService.getEmptyContact();
        vm.nationalityVisible = false;
        vm.title = 'Edit contact';
        vm.submitText = 'Save';
        vm.submit = submit;
        vm.showDatePicker = showDatePicker;
        vm.details = contactDetailsService;
        vm.comments = contactCommentsService;
        vm.cancel = contactDetailsService.cancel;
        vm.isManager = authService.isManager();
        vm.aclHandler = contactDetailsService.createAclHandler(function () {
            return vm.contact.id;
        });

        init(vm);

        function init(context) {
            $q.all(
                [
                    initDictionary(),
                    isEditable(),
                    getAcls(),
                    setDatePickerOptions(context)
                ]
            ).then(getContact);
        }

        function initDictionary() {
            return vm.details.getDictionary().then(function (response) {
                vm.dictionary = response;
            });
        }

        function submit() {
            if (!vm.contact.photoUrl){
                vm.contact.photoUrl = vm.contact.oldPhotoUrl;
            }
            contactDetailsService.submit(vm.contact, vm.aclHandler.acls, false);
        }

        function addComment(comment) {
            vm.contact.comments.push(vm.comments.create(authService.getContactName(), comment));
        }

        function getAcls() {
            return contactService.getAcls($stateParams.id).then(function (response) {
                vm.aclHandler.acls = response.data;
            });
        }

        function isEditable() {
            return contactSecurityService.checkEditPermission($stateParams.id).then(function (canEdit) {
                vm.canEdit = canEdit;
                vm.aclHandler.canEdit = canEdit;
                if (!canEdit) {
                    vm.submitText = null;
                    vm.cancelText = 'Ok';
                }
            });
        }

        function getContact() {
            return contactService.get($stateParams.id).then(function (response) {
                vm.contact = response.data;

                if ((vm.contact.photoUrl != null) && vm.contact.photoUrl.startsWith('file')){
                    vm.contact.photoUrl = vm.contact.photoUrl.substr(6);
                }
                vm.contact.oldPhotoUrl = vm.contact.photoUrl;
                vm.contact.photoUrl = '';

            });
        }

        function showDatePicker(context, datePickerName) {
            context.isDatePickerVisible[datePickerName] = true;
        }

        function setDatePickerOptions(context) {
            var minBirthDate = new Date(new Date().setFullYear(new Date().getFullYear() + vm.NINETY_YEARS_AGO)); // now - 90 years
            var educationMaxDate = new Date(new Date().setFullYear(new Date().getFullYear() + vm.TEN_YEARS_LATER)); // now + 10 years
            var minDate = new Date(new Date().setFullYear(new Date().getFullYear() + vm.FIFTY_YEARS_AGO)); // now - 50 years
            var maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + vm.TEN_YEARS_AGO)); // now - 10 years
            context.isDatePickerVisible = {
                startDate : false,
                endDate : false,
                birthDate : false
            };
            context.datePickerOptions = {
                workplaceStartDate : {
                    minDate: minDate,
                    maxDate: Date.now(),
                    startingDay : 1
                },
                workplaceEndDate : {
                    minDate: minDate,
                    maxDate: Date.now(),
                    startingDay : 1
                },
                birthDate :{
                    minDate : minBirthDate,
                    maxDate : maxDate,
                    initDate : maxDate,
                    startingDay : 1
                },
                educationStartDate : {
                    minDate: minDate,
                    maxDate: Date.now(),
                    startingDay : 1
                },
                educationEndDate : {
                    minDate: minDate,
                    maxDate: educationMaxDate,
                    startingDay : 1
                }
            };
        }
    }
})();

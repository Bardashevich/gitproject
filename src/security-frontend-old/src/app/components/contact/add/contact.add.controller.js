(function () {
    'use strict';

    angular
        .module('crm.contact')
        .controller('contactAddController', contactAddController);

    /** @ngInject */
    function contactAddController($stateParams, contactDetailsService, userService) {
        var vm = this;

        vm.TEN_YEARS_LATER = 10;
        vm.TEN_YEARS_AGO = -10;
        vm.FIFTY_YEARS_AGO = -50;
        vm.NINETY_YEARS_AGO = -90;

        vm.canEdit = true;
        vm.contact = contactDetailsService.getEmptyContact();
        vm.nationalityVisible = true;
        vm.title = 'Add contact';
        vm.submitText = 'Add';
        vm.submit = submit;
        vm.contact.id = 0;
        vm.showDatePicker = showDatePicker;
        vm.details = contactDetailsService;
        vm.cancel = contactDetailsService.cancel;
        vm.aclHandler = contactDetailsService.createAclHandler(function () {
            return vm.contact.id;
        });

        init(vm);

        function init(context) {
            setDatePickerOptions(context);
            return initAcls().then(initDictionary).then(initNationality);
        }

        function initAcls() {
            return userService.getDefaultAcls().then(function (response) {
                if ($stateParams.group === 'students') {
                    vm.aclHandler.acls = [
                        {
                            canAdmin: false,
                            canCreate: false,
                            canDelete: false,
                            canRead: false,
                            canWrite: false,
                            name: 'students',
                            principalId: 7,
                            principalTypeName: 'group'
                        },
                        {
                            canAdmin: false,
                            canCreate: true,
                            canDelete: true,
                            canRead: true,
                            canWrite: true,
                            name: 'D1',
                            principalId: 9,
                            principalTypeName: 'group'
                        }
                    ];
                } else {
                    vm.aclHandler.acls = response.data;
                }
            });
        }

        function initDictionary() {
            return vm.details.getDictionary().then(function (response) {
                vm.dictionary = response;
            });
        }

        function initNationality() {
            return vm.details.getNationalities().then(function (response) {
                vm.nationalities = response;
            });
        }

        function detectNationality() {
            if (vm.contact.nationalityList !== 'other'){
                vm.contact.nationality = vm.contact.nationalityList;
            }
        }

        function submit() {
            detectNationality();
            contactDetailsService.submit(vm.contact, vm.aclHandler.acls, true);
        }

        function showDatePicker(context, datePickerName) {
            context.isDatePickerVisible[datePickerName] = true;
        }

        function setDatePickerOptions(context) {
            var minBirthDate = new Date(new Date().setFullYear(new Date().getFullYear() + vm.NINETY_YEARS_AGO)); // now - 90 years
            var minDate = new Date(new Date().setFullYear(new Date().getFullYear() + vm.FIFTY_YEARS_AGO)); // now - 50 years
            var maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + vm.TEN_YEARS_AGO)); // now - 10 years
            context.isDatePickerVisible = {
                workplaceStartDate : false,
                workplaceEndDate : false,
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
                birthDate : {
                    minDate : minBirthDate,
                    maxDate : maxDate,
                    initDate : maxDate,
                    startingDay : 1
                },
                educationStartDate : {
                    minDate: minDate,
                    maxDate: Date.now(),
                    startingDay : 1
                }
            };
        }
    }
})();

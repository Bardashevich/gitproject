(function () {
    'use strict';

    angular
        .module('crm.contact')
        .controller('contactListController', contactListController);

    /** @ngInject */
    function contactListController($q, authService, contactService, searchService, dialogService, $state, contactSecurityService,
                                   contactReportGeneratorDetailsService, contactDetailsService) {
        var vm = this;

        vm.isManager = authService.isManager();
        vm.searchContactBundle = searchService.contactMode();
        vm.add = add;
        vm.edit = edit;
        vm.remove = remove;
        vm.generateReports = generateReports;

        init();

        function init() {
            vm.searchContactBundle.clearItemsList();
            vm.searchContactBundle.find();
        }

        function add() {
            $state.go('contacts.add');
        }

        function edit(contact) {
            contactSecurityService.checkReadPermission(contact.id).then(function () {
                $state.go('contacts.edit', {id: contact.id});
            });
        }

        function remove() {
            var checkedContacts = vm.searchContactBundle.itemsList.filter(function (contact) {
                return contact.checked;
            });
            if (checkedContacts.length > 0) {
                openRemoveDialog().then(function () {
                    contactSecurityService.checkDeletePermissionForList(checkedContacts).then(removeContacts);
                });
            }
        }

        function removeContacts(checkedContacts) {
            var tasks = [];
            checkedContacts.forEach(function (contact) {
                if (contact.checked) {
                    tasks.push(contactService.remove(contact.id));
                }
            });
            $q.all(tasks).then(vm.searchContactBundle.find);
        }

        function openRemoveDialog() {
            return dialogService.confirm('Do you want to delete this contact?').result;
        }

        function generateReports() {
            var checkedContacts = vm.searchContactBundle.itemsList.filter(function (contact) {
                return contact.checked;
            });
            contactDetailsService.getDictionary().then(function (dictionary) {
                contactReportGeneratorDetailsService.generateReports(dictionary, checkedContacts);
            });

        }
    }
})();

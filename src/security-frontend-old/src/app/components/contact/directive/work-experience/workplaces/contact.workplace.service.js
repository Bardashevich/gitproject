(function () {
    'use strict';

    angular
        .module('crm.contact')
        .service('contactWorkplaceService', contactWorkplaceService);

    /** @ngInject */
    function contactWorkplaceService(contactService, dialogService, contactCommonService) {

        var detailsUrl = 'app/components/contact/directive/work-experience/workplaces/contact.workplace.details.view.html';

        return {
            add: add,
            edit: edit,
            remove: remove
        };

        function add(scope) {
            openAddDialog(scope).then(function (model) {
                scope.contact.workplaces.push(model.workplace);
            });
        }

        function edit(workplace, scope) {
            openEditDialog(workplace, scope).then(function (model) {
                angular.copy(model.workplace, workplace);
            });
        }

        function remove(scope) {
            return contactCommonService.remove(scope.contact, scope.contact.workplaces, contactService.removeWorkplace);
        }

        function openAddDialog(scope) {
            return dialogService.custom(detailsUrl, {
                title: 'Add Workplace',
                size: 'modal--user-table',
                cancelTitle: 'Cancel',
                okTitle: 'Add',
                workplace: {},
                details:{now:new Date()},
                parentContext: scope
            }).result;
        }

        function openEditDialog(workplace, scope) {
            return dialogService.custom(detailsUrl, {
                title: 'Update Workplace',
                size: 'modal--user-table',
                cancelTitle: 'Cancel',
                okTitle: 'Save',
                workplace: angular.copy(workplace),
                parentContext: scope
            }).result;
        }
    }
})();

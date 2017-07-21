(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .controller('OpportunityEditController', OpportunityEditController);

    /** @ngInject */
    function OpportunityEditController($uibModalInstance, opportunity, contactService, $log) {
        var vm = this;
        vm.cancel = cancel;
        vm.opportunity = opportunity;

        function cancel() {
            $uibModalInstance.dismiss();
        }

        getContact();
        function getContact() {
            return contactService.get(opportunity.contactId).then(function (response) {
                vm.opportunity.contact = response.data;
            });
        }

        $log.log(opportunity);
    }
})();


(function () {
    'use strict';
    angular
        .module('crm.vacancy')
        .controller('OpportunityReasonViewController', OpportunityReasonViewController);

    /** @ngInject */

    function OpportunityReasonViewController($uibModalInstance, isReasonAllowed, isCommentAllowed) {

        var vm = this;

        vm.isCommentAllowed = isCommentAllowed;
        vm.isReasonAllowed = isReasonAllowed;
        vm.comment = '';
        vm.reason = '';

        vm.cancel = function () {
            $uibModalInstance.dismiss(false);
        };

        vm.accept = function () {
            $uibModalInstance.close({reason:vm.reason, comment:vm.comment});
        };
    }

})();

(function () {
    'use strict';

    angular
        .module('crm.contact')
        .directive('crmContactComments', crmContactComments);

    /** @ngInject */
    function crmContactComments() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/contact/directive/comments/crm-contact-comments.html',
            scope: false
        };
    }
})();

/**
 * Created by artsiom.marenau on 1/31/2017.
 */
(function () {
    'use strict';

    angular
        .module('crm.contact')
        .directive('crmContactLanguages', crmContactLanguages);

    /** @ngInject */
    function crmContactLanguages() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/contact/directive/general-info/languages/crm-contact-languages.html',
            scope: false
        };
    }
})();

(function () {
    'use strict';
    angular
        .module('crm.contact')
        .directive('validateUrl', crmSocialNetworkValidator);

    function crmSocialNetworkValidator() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {

                function isValid(value) {
                    ctrl.$setValidity('validUrl', false);

                    scope.vm.socialNetworks.forEach(function (socialNetwork) {
                        var data = socialNetwork.name;
                        var regExp = new RegExp('.*' + data.toLowerCase() + '.*', 'i');
                        regExp.test(value) && ctrl.$setValidity('validUrl', true);
                    });

                    return value;
                }

                ctrl.$parsers.push(isValid);
            }
        };
    }

})();

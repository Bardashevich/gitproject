/**
 * Created by artsiom.marenau on 1/25/2017.
 */
(function () {
    'use strict';

    angular
        .module('crm.navbar')
        .directive('crmUserAvatar', crmUserAvatar);

    /** @ngInject */
    function crmUserAvatar($http) {
        return {
            restrict: 'A',
            scope: {
                contact: '=',
                loggedUser: '='
            },
            link: function (scope, element, attrs) {
                element.on('error', function () {
                    attrs.$set('src', './assets/images/default-avatar.png');
                });
                scope.$watch('loggedUser', function (value) {
                    if (value && scope.contact > 0) {
                        $http.get('rest/images/contact/' + scope.contact + '?' + getCurrentTime(),
                            {responseType: 'arraybuffer'})
                            .success(function (data) {
                                var arrayBufferView = new Uint8Array(data);
                                var blob = new Blob([arrayBufferView], {type: 'image/png'});
                                var urlCreator = window.URL || window.webkitURL;
                                var imageUrl = urlCreator.createObjectURL(blob);
                                attrs.$set('ngSrc', imageUrl);
                            });
                    } else {
                        attrs.$set('ngSrc', './assets/images/default-avatar.png');
                    }
                });

                function getCurrentTime() {
                    return (new Date()).getTime();
                }

            }
        };
    }
})();

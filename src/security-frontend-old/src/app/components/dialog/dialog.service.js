(function () {
    'use strict';

    angular
        .module('crm.dialog')
        .factory('dialogService', dialogService)
        .controller('ErrorDialogController', ErrorDialogController)
        .controller('NotifyDialogController', NotifyDialogController)
        .controller('ConfirmDialogController', ConfirmDialogController)
        .controller('CustomInfoDialogController', CustomInfoDialogController)
        .controller('CustomDialogController', CustomDialogController);

    /** @ngInject */
    function dialogService($uibModal) {
        return {
            notify: notify,
            error: error,
            confirm: confirm,
            custom: custom,
            customInfo: customInfo
        };

        function notify(message) {
            return $uibModal.open({
                templateUrl: 'app/components/dialog/notify.view.html',
                controller: 'NotifyDialogController',
                controllerAs: 'vm',
                resolve: {
                    message: function () {
                        return message;
                    }
                }
            });
        }

        function error(message) {
            return $uibModal.open({
                templateUrl: 'app/components/dialog/error.view.html',
                controller: 'ErrorDialogController',
                controllerAs: 'vm',
                resolve: {
                    message: function () {
                        return message;
                    }
                }
            });
        }

        function confirm(message) {
            return $uibModal.open({
                templateUrl: 'app/components/dialog/confirm.view.html',
                controller: 'ConfirmDialogController',
                controllerAs: 'vm',
                resolve: {
                    message: function () {
                        return message;
                    }
                }
            });
        }

        function custom(bodyUrl, model) {
            return $uibModal.open({
                templateUrl: bodyUrl,
                controller: 'CustomDialogController',
                controllerAs: 'vm',
                keyboard: true,
                backdrop: false,
                size: model.size,// if undefined or null, then property will not used
                resolve: {
                    model: model
                }
            });
        }

        function customInfo(bodyUrl, model) {
            return $uibModal.open({
                templateUrl: bodyUrl,
                controller: 'CustomInfoDialogController',
                controllerAs: 'vm',
                backdrop: false,
                windowClass: 'information',
                resolve: {
                    model: model
                }
            });
        }
    }

    /** @ngInject */
    function ErrorDialogController($uibModalInstance, message) {
        var vm = this;
        vm.message = message || 'An unknown error has occurred.';
        vm.close = function () {
            $uibModalInstance.close();
        };
    }

    /** @ngInject */
    function NotifyDialogController($uibModalInstance, message) {
        var vm = this;
        vm.message = message || 'Unknown application notification.';
        vm.close = function () {
            $uibModalInstance.close();
        };
    }

    /** @ngInject */
    function ConfirmDialogController($uibModalInstance, message) {
        var vm = this;
        vm.message = message || 'Are you sure?';
        vm.no = function () {
            $uibModalInstance.dismiss(false);
        };
        vm.yes = function () {
            $uibModalInstance.close(true);
        };
    }

    /** @ngInject */
    function CustomDialogController($uibModalInstance, model) {
        var vm = this;
        angular.extend(vm, model);
        vm.title = model.title || 'Dialog';
        vm.okTitle = model.okTitle;
        vm.cancelTitle = model.cancelTitle;
        vm.ok = function () {
            $uibModalInstance.close(vm);
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }

    var pullPopup = [];
    var HEIGHT_POPUP = 120;
    var MAX_PULL_SIZE = 5;
    var TIME_CLOSING = 5000;
    var DELTA_TIME = 100;
    /** @ngInject */
    function CustomInfoDialogController($uibModalInstance, model, $timeout, $window) {

        var vm = this;
        vm.instance = $uibModalInstance;
        addPopupToPull(vm);
        angular.extend(vm, model);
        vm.title = model.title || 'Info';
        vm.newComment = model.newComment;
        vm.author = model.author;
        vm.date = model.date;
        vm.student = model.student;
        vm.uniqueId = 'webSocket' + Date.now();
        vm.close = function () {
            closePopup(vm);
        };
        vm.bodyClick = function () {
            model.bodyClick();
            closePopup(vm);
        };

        vm.timerWaits = true;
        vm.startTimerForClosingPopup = function () {
            var mouseIsEnter = false;
            vm.popup = angular.element('.information').has('.' + vm.uniqueId);
            if (vm.timerWaits) {
                var allTime = TIME_CLOSING;
                $timeout(tic, DELTA_TIME);
                vm.timerWaits = false;
                vm.popup.mouseenter(function () {
                    mouseIsEnter = true;
                });
                vm.popup.mouseleave(function () {
                    mouseIsEnter = false;
                });
            }

            function tic() {
                if (!mouseIsEnter) {
                    allTime -= DELTA_TIME;
                } else {
                    allTime = TIME_CLOSING;
                }
                if (allTime <= 0) {
                    closePopup(vm);
                    return;
                }
                vm.popup.css('opacity', allTime / TIME_CLOSING);
                $timeout(tic, DELTA_TIME);
            }
        };
        function addPopupToPull(newPopup) {
            if (pullPopup.length + 1 > MAX_PULL_SIZE) {
                closePopup(pullPopup[0]);
            }
            pullPopup.push(newPopup);
            updatePopupPosition();
        }
        function updatePopupPosition() {
            for (var i = pullPopup.length - 1; i >= 0; i--) {
                angular.element('.information').has('.' + pullPopup[i].uniqueId).css('bottom', (pullPopup.length - i - 1) * HEIGHT_POPUP + 'px');
            }
        }
        function closePopup(vm) {
            var key = pullPopup.indexOf(vm);
            if (key > -1) {
                pullPopup.splice(key, 1);
                updatePopupPosition();
            }
            vm.instance.close();
        }
        function whenMouseMoveStartClosingPopup() {
            for (var i = pullPopup.length - 1; i >= 0; i--) {
                pullPopup[i].startTimerForClosingPopup();
            }
        }
        $window.addEventListener('mousemove', whenMouseMoveStartClosingPopup);
    }
})();

(function () {
    'use strict';

    angular
        .module('crm.dashboard')
        .factory('dashboardService', dashboardService);

    /** @ngInject */
    function dashboardService($http, dateService, dialogService) {
        return {
            updateDashItem: updateDashItem,
            getDashboardsList: getDashboardsList,
            find: find,
            openCommentsView: openCommentsView,
            findComments: findComments,
            findUnreadComments: findUnreadComments,
            setCountUnreadCommentsInZero: setCountUnreadCommentsInZero,
            openUnreadComments: openUnreadComments,
            getDefaultDashboardsList: getDefaultDashboardsList
        };

        function updateDashItem(dashboard) {
            return $http.put('rest/dashboard/update', dashboard);
        }

        function getDashboardsList() {
            return $http.get('rest/dashboard/list/');
        }

        function getDefaultDashboardsList() {
            return $http.get('rest/dashboard/defaultList/');
        }


        function find(filter) {
            return $http.post('rest/contacts/students/list', filter);
        }

        function findComments(filter) {
            return $http.post('rest/contacts/comments/list', filter);
        }

        function findUnreadComments(filter) {
            return $http.post('rest/contacts/unread/comments/list', filter);
        }

        function setCountUnreadCommentsInZero() {
            return $http.put('rest/contacts/unread/comments/zero');
        }

        function openUnreadComments(title, context) {
            return dialogService.custom('app/components/dashboard/custom-charts/views/popups/dashboard-popup-view-unread-comments.html', {
                title: title,
                close: function (scope) {
                    if (scope.context.searchCommentBundle.name === 'commentBundle'){
                        scope.cancel();
                    } else {
                        setCountUnreadCommentsInZero();
                        scope.cancel();
                    }
                },
                setTextCommitAfterSortBy: function (scope) {
                    scope.text = null;
                },
                onPageChanged: function (scope) {
                    scope.context.searchCommentBundle.paging.onPageChanged();
                    scope.text = null;
                },
                setSelected: function (scope, comment) {
                    var index = -1;
                    angular.forEach(scope.context.searchCommentBundle.itemsList, function () {
                        index = index + 1;
                        scope.context.searchCommentBundle.itemsList[index].selected = false;
                        comment.selected = true;
                    });
                    scope.text = comment.text;
                },
                text: null,
                context: context
            }).result;
        }

        function openCommentsView(title, context) {
            return dialogService.custom('app/components/dashboard/custom-charts/views/popups/dashboard-popup-comments-view.html', {
                title: title,
                close: function (scope) {
                    if (scope.context.searchCommentBundle.name === 'commentBundle'){
                        scope.cancel();
                    } else {
                        setCountUnreadCommentsInZero();
                        scope.cancel();
                    }
                },
                setTextCommitAfterSortBy: function (scope) {
                    scope.text = null;
                },
                onPageChanged: function (scope) {
                    scope.context.searchCommentBundle.paging.onPageChanged();
                    scope.text = null;
                },
                setSelected: function (scope, comment) {
                    var index = -1;
                    angular.forEach(scope.context.searchCommentBundle.itemsList, function () {
                        index = index + 1;
                        scope.context.searchCommentBundle.itemsList[index].selected = false;
                        comment.selected = true;
                    });
                    scope.text = comment.text;
                },
                text: null,
                context: context
            }).result;
        }
    }
})();

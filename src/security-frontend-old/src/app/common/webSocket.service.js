(function () {
    'use strict';

    angular
        .module('crm.common')
        .factory('webSocketService', webSocketService);

    /** @ngInject */
    function webSocketService($state, dialogService, searchService, authService) {
        var stompClient = null;

        function connect() {
            if (stompClient != null) {
                disconnect();
            }
            if (authService.isHR() || authService.isDepartmentManager() || authService.isTutor()) {
                stompClient = Stomp.over(new SockJS('/rest'));
                stompClient.connect({}, function () {
                    stompClient.subscribe('/topic/greetings', function (student) {
                        openPopup(JSON.parse(student.body));
                    });
                });
            }
        }

        function disconnect() {
            if (stompClient != null) {
                stompClient.disconnect();
                stompClient = null;
            }
        }

        function openPopup(student) {
            var comment = getNewComments(student);
            comment = getLastComment(comment);
            if (isCommentFromThisUser()){
                return;
            }
            authService.setCountUnreadComments(authService.getCountUnreadComments() + 1);
            return dialogService.customInfo('app/components/dashboard/custom-charts/views/popups/added-comments-for-student-view.html', {
                newComment: comment.text,
                author : comment.author,
                date : comment.date,
                student : student.lastName + ' ' + student.firstName,
                bodyClick: bodyClick
            }).result;

            function isCommentFromThisUser() {
                return comment.author == authService.getUserName();
            }

            function getNewComments(student) {
                var comment = student.comments.filter(function (item) {
                    return item.id == null;
                });
                return comment;
            }

            function getLastComment(comment) {
                comment = comment.sort(function (a, b) {
                    var dataA = new Date(a.date);
                    var dataB = new Date(b.date);
                    return dataA - dataB;
                });
                return comment[comment.length - 1];
            }

            function bodyClick() {
                $state.go('dashboards');
                searchService.showStudentComments(student, student);
            }
        }

        return {
            connect: connect,
            disconnect: disconnect
        };
    }
})();

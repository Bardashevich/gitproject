(function () {
    'use strict';

    angular
        .module('crm.contact')
        .service('contactCommentService', contactCommentService);

    /** @ngInject */
    function contactCommentService(contactService, dialogService, contactCommonService, authService, contactCommentsService) {

        return {
            add: addComment,
            get: getComment,
            edit: editComment,
            remove: removeComment,
            addStudentComment: addCommentByContact
        };

        function addCommentByContact(contact) {
                contact.comments = [];
            openAddCommentDialog('Add comment', '').then(function (model) {
                contact.comments.push(contactCommentsService.create(authService.getContactName(), model.comment.newComment));
                contactService.addContactComment(contact);
            });
        }

        function addComment(scope) {
            openAddCommentDialog('Add comment', '').then(function (model) {
                scope.contact.comments.push(contactCommentsService.create(authService.getContactName(), model.comment.newComment));
            });
        }

        function getComment(contactId, attachment) {
            return contactService.getAttachment(contactId, attachment);
        }

        function editComment(comment) {
            openAddCommentDialog('Edit comment', comment.text).then(function (model) {
                scope.contact.comments.push(contactCommentsService.create(authService.getContactName(), model.comment.newComment));
            });
        }

        function removeComment(scope) {
            return contactCommonService.remove(scope.contact, scope.contact.comments, contactService.removeComment);
        }

        function openAddCommentDialog(title, comment) {
            return dialogService.custom('app/components/contact/directive/comments/add/contact.comment.add.view.html', {
                title: title,
                size: 'modal--user-table',
                cancelTitle: 'Cancel',
                okTitle: 'Add',
                comment: {newComment: comment}
            }).result;
        }

    }
})();

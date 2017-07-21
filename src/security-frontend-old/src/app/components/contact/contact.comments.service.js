(function () {
    'use strict';

    angular
        .module('crm.contact')
        .factory('contactCommentsService', contactCommentsService);
    /** @ngInject */
    function contactCommentsService() {

        return {
            create: create,
            edit: edit,
            remove: remove,
            update: update
        };

        function create(author, text) {
            return (
            {
                date : new Date(),
                author : author,
                text : text,
                deleted: false
            });
        }

        function edit(comment) {
            comment.isEdited = true;
        }

        function remove(comment) {
            comment.deleted = true;
        }

        function update(comment) {
            comment.isEdited = false;
        }
    }
})();

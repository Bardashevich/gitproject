(function () {
    'use strict';

    angular
        .module('crm.contact')
        .factory('contactService', contactService);

    /** @ngInject */
    function contactService($http, $window) {
        return {
            create: create,
            get: get,
            getByUserId: getByUserId,
            update: update,
            remove: remove,
            find: find,
            getAcls: getAcls,
            updateAcls: updateAcls,
            removeAcl: removeAcl,
            isAllowed: isAllowed,
            addAttachment: addAttachment,
            removeAttachment: removeAttachment,
            removeComment: removeComment,
            getAttachment: getAttachment,
            removeEmail: removeEmail,
            removeTelephone: removeTelephone,
            removeAddress: removeAddress,
            removeMessengerAccount: removeMessengerAccount,
            removeSocialNetworkAccount: removeSocialNetworkAccount,
            getDictionary: getDictionary,
            removeWorkplace: removeWorkplace,
            removeSkill: removeSkill,
            parseProfile: parseProfile,
            removeEducation: removeEducation,
            getNationalityCategories: getNationalityCategories,
            getAllContacts: getAllContacts,
            getContactsByUserGroup: getContactsByUserGroup,
            addContactComment: addContactComment,
            getCurrentContact: getCurrentUserContact
        };

        function create(contact) {
            return $http.post('rest/contacts', contact);
        }

        function get(id) {
            return $http.get('rest/contacts/' + id);
        }

        function getCurrentUserContact() {
            return $http.get('rest/contacts/current/contact/');
        }

        function getByUserId(id) {
            return $http.get('rest/contacts/user/' + id);
        }

        function update(contact) {
            return $http.put('rest/contacts', contact);
        }

        function addContactComment(contact) {
            return $http.put('rest/contacts/comment', contact);
        }

        function remove(id) {
            return $http.delete('rest/contacts/' + id);
        }

        function find(filter) {
            return $http.post('rest/contacts/list', filter);
        }

        function getAcls(id) {
            return $http.get('rest/contacts/' + id + '/acls');
        }

        function updateAcls(id, acls) {
            return $http.put('rest/contacts/' + id + '/acls', acls);
        }

        function removeAcl(id, aclId) {
            return $http.delete('rest/contacts/' + id + '/acls/' + aclId);
        }

        function isAllowed(contactId, permission) {
            return $http.get('rest/contacts/' + contactId + '/actions/' + permission);
        }

        function getAttachment(contactId, attachment) {
            var url = 'rest/contacts/files/' + contactId + '/attachments/' + attachment.id;
            return $http.get(url + '/check').then(function () {
                $window.open('rest/files/contacts/' + contactId + '/attachments/' + attachment.id + '/' + attachment.name);
            });
        }

        function getAllContacts() {
            return $http.get('rest/contacts/list/all');
        }

        function getContactsByUserGroup(groupName) {
            return $http.get('rest/contacts/group/' + groupName);
        }

        function addAttachment(id, attachment) {
            return $http.post('rest/contacts/' + id + '/attachments', {
                attachment: attachment,
                filePath: attachment.filePath
            });
        }

        function removeAttachment(id, attachment) {
            attachment.dateDeleted = Date.now();
        }

        function removeComment(id, comment) {
            comment.deleted = true;
        }

        function removeEmail(id, email) {
            email.dateDeleted = Date.now();
        }

        function removeTelephone(id, telephone) {
            telephone.dateDeleted = Date.now();
        }

        function removeAddress(id, address) {
            address.dateDeleted = Date.now();
        }

        function removeMessengerAccount(id, account) {
            account.dateDeleted = Date.now();
        }

        function removeSocialNetworkAccount(id, account) {
            account.dateDeleted = Date.now();
        }

        function getDictionary() {
            return $http.get('rest/dictionary', {cache: true});
        }

        function removeWorkplace(id, workplace) {
            workplace.dateDeleted = Date.now();
        }

        function removeSkill(id, skill) {
            skill.dateDeleted = Date.now();
        }

        function parseProfile(profileUrl) {
            return $http.get('rest/parser/linkedIn', {params: {url: profileUrl}});
        }

        function removeEducation(id, education) {
            education.dateDeleted = Date.now();
        }

        function getNationalityCategories() {
            return $http.get('rest/contacts/nationalities', {cache: true});
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('crm.common')
        .factory('authService', authService);

    /** @ngInject */
    function authService($http, $q, contactService) {
        var service = this;

        service.authentication = null;

        return {
            login: login,
            logout: logout,
            restore: restore,
            getContactName: getContactName,
            getContactId: getContactId,
            getUserName: getUserName,
            isAuthenticated: isAuthenticated,
            getAuthentication: getAuthentication,
            setAuthentication: setAuthentication,
            isAdmin: isAdmin,
            isManager: isManager,
            isSpecialist: isSpecialist,
            isHR: isHR,
            isDepartmentManager: isDepartmentManager,
            isTutor: isTutor,
            getAuthStatus: getAuthStatus,
            getCountUnreadComments: getCountUnreadComments,
            setCountUnreadComments: setCountUnreadComments
        };

        function getContactName() {
            var auth = getAuthentication();
            return (auth && auth.contact) ? auth.contact.firstName + ' ' + auth.contact.lastName : getUserName();
        }

        function getCountUnreadComments() {
            if (service.countUnreadCommentsService == null) {
                var auth = getAuthentication();
                if ((auth != null) && (auth.countUnreadComments != null)) {
                    service.countUnreadCommentsService = auth.countUnreadComments;
                }
            }
            return service.countUnreadCommentsService;
        }

        function setCountUnreadComments(count) {
            service.countUnreadCommentsService = count;
        }

        function getContactId() {
            var auth = getAuthentication();
            return (auth && auth.contact) ? auth.contact.id : 0;
        }

        function getUserName() {
            var auth = getAuthentication();
            return auth ? auth.username : null;
        }

        function setAuthentication(authData) {
            service.authentication = authData;
            if (authData != null) {
                contactService.getByUserId(service.authentication.userId).then(function (response) {
                    service.authentication.contact = response.data;
                });
            }
        }

        function login(username, password, rememberMe) {
            return $http.post('rest/login', {
                username: username,
                password: password,
                rememberMe: rememberMe
            }).then(function (response) {
                if (response.data.countUnreadComments != null) {
                    service.countUnreadCommentsService = response.data.countUnreadComments;
                    setAuthentication(response.data);
                }
                return response;
            }, function (error) {
                setAuthentication(null);
                return $q.reject(error);
            });
        }


        function logout() {
            return getAuthStatus().then(function () {
                    return $http.post('rest/logout').then(function () {
                        setAuthentication(null);
                        return $q.resolve();
                    });
                });
        }

        function restore() {
            return $http.get('rest/login/roles').then(
                function (response) {
                    setAuthentication(response.data);
                    return $q.resolve(response);
                }, function () {
                    setAuthentication(null);
                    return $q.reject();
                }
            );
        }

        function isAuthenticated() {
            return !!service.authentication;
        }

        function getAuthStatus() {
            return $http.get('rest/login/check').then(
                function (response) {
                    if (response.data) {
                        return $q.resolve();
                    } else {
                        return $q.reject();
                    }
                }
            );
        }


        function getAuthentication() {
            return angular.copy(service.authentication);
        }

        function hasRole(role) {
            return isAuthenticated()
                && service.authentication
                && service.authentication.roles
                && service.authentication.roles.indexOf(role) !== -1;
        }

        function isAdmin() {
            return hasRole('ADMIN');
        }

        function isManager() {
            return hasRole('MANAGER');
        }

        function isSpecialist() {
            return hasRole('SPECIALIST');
        }

        function isHR() {
            return hasRole('HR');
        }

        function isDepartmentManager() {
            return hasRole('DEPARTMENT_MANAGER');
        }

        function isTutor() {
            return hasRole('TUTOR');
        }
    }
})();

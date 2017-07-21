(function () {
    'use strict';

    angular
        .module('crm.common')
        .factory('searchService', searchService);

    /** @ngInject */
    function searchService(userService, contactService, companyService, taskService,
                           dateService, vacancyService, util, $filter, $state, dashboardService) {
        return {
            userPublicMode: getPublicBundle,
            userSecurityMode: getSecurityBundle,
            contactMode: getContactBundle,
            companyMode: getCompanyBundle,
            getTaskBundle: getTaskBundle,
            vacancyMode : getVacancyBundle,
            vacancyOnDashboardMode: getVacancyOnDashboardBundle,
            opportunitiesMode: getOpportunitiesBundle,
            studentMode: getStudentBundle,
            commentMode: getCommentBundle,
            setContactId: setContactId,
            showStudentComments: showStudentComments,
            showUnreadComments: showUnreadComments,
            setPageSize: setPageSize,
            unreadCommentMode: getUnreadCommentBundle,
            getVacancyOnDashboardBundle: getVacancyOnDashboardBundle
        };

        function getPublicBundle() {
            var bundle = createCommonBundle();
            bundle.selectAll = createSelectAllAction(bundle, userPredicate);
            bundle.performSeach = userService.findPublicUsers;
            bundle.sortProperties.userName = {name: 'userName', asc: true, enabled: false};
            return bundle;
        }

        function getSecurityBundle() {
            var bundle = createCommonBundle();
            bundle.selectAll = createSelectAllAction(bundle, userPredicate);
            bundle.performSeach = userService.find;
            bundle.sortProperties.userName = {name: 'userName', asc: true, enabled: false};
            bundle.filter.groupId = null;
            bundle.filter.roleId = null;
            bundle.filter.active = true;
            return bundle;
        }

        function getContactBundle() {
            var bundle = createCommonBundle();
            bundle.selectAll = createSelectAllAction(bundle);
            bundle.performSeach = contactService.find;
            bundle.sortProperties.firstName = {name: 'firstName', asc: true, enabled: true};
            bundle.sortProperties.address = {name: 'address', asc: true, enabled: false};
            bundle.filter.sortProperty = bundle.sortProperties.firstName.name;
            bundle.filter.sortAsc = bundle.sortProperties.firstName.asc;
            return bundle;
        }

        function getStudentBundle() {
            var NAME_BUNDLE = 'STUDENT_BUNDLE'
            var bundle = createRubberBundle(NAME_BUNDLE);
            bundle.nameBundle = NAME_BUNDLE;
            bundle.selectAll = createSelectAllAction(bundle);
            bundle.performSeach = dashboardService.find;
            bundle.sortProperties.firstName = {name: 'firstName', asc: true, enabled: true};
            bundle.sortProperties.address = {name: 'address', asc: true, enabled: false};
            bundle.filter.sortProperty = bundle.sortProperties.firstName.name;
            bundle.filter.sortAsc = bundle.sortProperties.firstName.asc;
            return bundle;
        }

        function getCommentBundle(contactId) {
            var bundle = createCommentBundle('commentBundle');
            bundle.selectAll = createSelectAllAction(bundle);
            bundle.pageSize = setPageSize(bundle, 10);
            bundle.name = 'commentBundle';
            bundle.performSeach = dashboardService.findComments;
            bundle.sortProperties.created = {name: 'created', asc: true, enabled: true};
            bundle.filter.id = setContactId(bundle, contactId);
            bundle.filter.sortProperty = bundle.sortProperties.created.name;
            bundle.filter.sortAsc = bundle.sortProperties.created.asc;
            return bundle;
        }

        function getUnreadCommentBundle() {
            var bundle = createCommentBundle('unreadCommentBundle');
            bundle.selectAll = createSelectAllAction(bundle);
            bundle.pageSize = setPageSize(bundle, 15);
            bundle.name = 'unreadCommentBundle';
            bundle.performSeach = dashboardService.findUnreadComments;
            bundle.sortProperties.created = {name: 'created', asc: true, enabled: true};
            bundle.filter.sortProperty = bundle.sortProperties.created.name;
            bundle.filter.sortAsc = bundle.sortProperties.created.asc;
            return bundle;
        }

        function getCompanyBundle() {
            var bundle = createCommonBundle();
            bundle.performSeach = companyService.find;
            bundle.selectAll = createSelectAllAction(bundle);
            bundle.sortProperties = {
                name: {name: 'name', asc: true, enabled: true},
                employeeNumber: {name: 'employeeNumberCategory.id', asc: true, enabled: true}
            };
            bundle.filter.sortProperty = bundle.sortProperties.name.name;
            bundle.filter.sortAsc = bundle.sortProperties.name.asc;
            return bundle;
        }

        function getTaskBundle() {
            var bundle = createCommonBundle();
            bundle.selectAll = createSelectAllAction(bundle);
            bundle.performSeach = taskService.find;
            bundle.sortProperties = {
                startDate: {name: 'startDate', asc: false, enabled: true},
                status: {name: 'status', asc: true, enabled: false},
                priority: {name: 'priority', asc: true, enabled: false}
            };
            bundle.filter.sortProperty = bundle.sortProperties.startDate.name;
            bundle.filter.sortAsc = bundle.sortProperties.startDate.asc;
            return bundle;
        }

        function getVacancyBundle() {
            var bundle = createCommonBundle();
            bundle.selectAll = createSelectAllAction(bundle);
            bundle.performSeach = vacancyService.find;
            bundle.sortProperties = {};
            bundle.filter.sortProperty = null;
            bundle.filter.sortAsc = false;
            bundle.isShowClosed = false;
            bundle.filter.displayedPeriodStart = dateService.getFirstDateOfPreviousMonth(1).getTime();
            bundle.filter.displayedPeriodEnd = dateService.getLastDateOfCurrentMonth().getTime();
            bundle.showClosed = function (value) {
                if (value){
                    bundle.filter.showClosed = true;
                }else {
                    bundle.filter.showClosed = false;
                }
                bundle.find();
            };
            return bundle;
        }

        function getVacancyOnDashboardBundle() {
            var NAME_BUNDLE = 'VACANCY_ON_DASHBOARD_BUNDLE'
            var bundle = createRubberBundle(NAME_BUNDLE);
            bundle.nameBundle = NAME_BUNDLE;
            bundle.selectAll = createSelectAllAction(bundle);
            bundle.performSeach = vacancyService.find;
            bundle.sortProperties = {};
            bundle.filter.sortProperty = null;
            bundle.filter.sortAsc = false;
            return bundle;
        }

        function getOpportunitiesBundle() {
            var bundle = createCommonBundle();
            bundle.selectAll = createSelectAllAction(bundle);
            bundle.performSeach = vacancyService.findOpportunities;
            bundle.sortProperties = {};
            bundle.filter.sortProperty = null;
            bundle.filter.sortAsc = false;
            return bundle;
        }

        function createSelectAllAction(bundle, predicate) {
            return function (checked) {
                bundle.itemsList.forEach(function (item) {
                    if (!predicate || predicate(item)) {
                        item.checked = checked;
                    }
                });
            };
        }

        function resetBundleState(bundle) {
            bundle.isSelectedAll = false;
        }

        function createCommonBundle() {
            if ($state.commonBundle){
                return $state.commonBundle;
            } else {
                var bundle = {};
                if (bundle.pageSize == null) {
                    bundle.pageSize = 20;
                }
                bundle.isSelectAll = false;
                bundle.clearItemsList = function () {
                    bundle.itemsList = [];
                };
                bundle.clearItemsList();
                bundle.paging = {
                    totalCount: 0,
                    itemsPerPage: bundle.pageSize,
                    currentPage: 1,
                    visiblePages: 5
                };

                bundle.paging.onPageChanged = function () {
                    var state = {};
                    state['#page'] = bundle.paging.currentPage;
                    bundle.filter.from = (bundle.paging.currentPage - 1) * bundle.pageSize;
                    bundle.find();
                };

                bundle.sortProperties = {
                    firstName: {name: 'firstName', asc: true, enabled: true},
                    lastName: {name: 'lastName', asc: true, enabled: false},
                    email: {name: 'email', asc: true, enabled: false},
                    created: {name: 'created', asc: false, enabled: true}
                };

                bundle.filter = {
                    from: 0,
                    count: bundle.pageSize,// todo: extract to config
                    text: null,
                    sortProperty: null,
                    sortAsc: true
                };
                bundle.filter.sortProperty = bundle.sortProperties.firstName.name;
                bundle.filter.sortAsc = bundle.sortProperties.firstName.asc;

                bundle.find = function find() {
                    resetBundleState(bundle);
                    angular.forEach(bundle.filter, function (value, key) {
                        if (angular.isString(value)) {
                            bundle.filter[key] = value ? value : null;
                        }
                    });
                    bundle.performSeach(bundle.filter).then(function (response) {
                        bundle.itemsList = response.data.data;
                        bundle.paging.totalCount = response.data.totalCount;
                    });
                };

                bundle.typing = util.createDelayTypingListener(bundle.find, 500);

                bundle.sortBy = function (property) {
                    angular.forEach(bundle.sortProperties, function (sortProperty) {
                        sortProperty.enabled = false;
                    });
                    property.enabled = true;
                    property.asc = !property.asc;
                    bundle.filter.sortAsc = property.asc;
                    bundle.filter.sortProperty = property.name;
                    bundle.find();
                };

                bundle.selectOne = function () {
                    bundle.isSelectedAll = bundle.itemsList.every(function (user) {
                        return user.checked;
                    });
                };

                $state.commonBundle = bundle;
                return bundle;
            }
        }

        function createCommentBundle(name) {
            if ($state.commentBundle && ($state.commentBundle.name == name)){
                return $state.commentBundle;
            } else {
                var bundle = {};
                if (bundle.pageSize == null) {
                    bundle.pageSize = 10;
                }
                bundle.isSelectAll = false;
                bundle.clearItemsList = function () {
                    bundle.itemsList = [];
                };
                bundle.clearItemsList();
                bundle.paging = {
                    totalCount: 0,
                    itemsPerPage: bundle.pageSize,
                    currentPage: 1,
                    visiblePages: 5
                };

                bundle.paging.onPageChanged = function () {
                    var state = {};
                    state['#page'] = bundle.paging.currentPage;
                    bundle.filter.from = (bundle.paging.currentPage - 1) * bundle.pageSize;
                    bundle.find();
                };

                bundle.sortProperties = {
                    created: {name: 'created', asc: false, enabled: true}
                };
                bundle.filter = {
                    from: 0,
                    count: bundle.pageSize,// todo: extract to config
                    text: null,
                    group: 'students',
                    sortProperty: null,
                    sortAsc: true
                };
                bundle.filter.sortProperty = bundle.sortProperties.created.name;
                bundle.filter.sortAsc = bundle.sortProperties.created.asc;

                bundle.find = function find() {
                    resetBundleState(bundle);
                    angular.forEach(bundle.filter, function (value, key) {
                        if (angular.isString(value)) {
                            bundle.filter[key] = value ? value : null;
                        }
                    });
                    bundle.performSeach(bundle.filter).then(function (response) {
                        bundle.itemsList = response.data.data;
                        var index = 0;
                        angular.forEach(response.data.data, function () {
                            index = index + 1;
                            if (response.data.data[index] != null) {
                                response.data.data[index].selected = false;
                            }
                        });
                        if (response.data.data[0] != null) {
                            response.data.data[0].selected = true;
                        }

                        bundle.paging.totalCount = response.data.totalCount;
                    });
                };

                bundle.typing = util.createDelayTypingListener(bundle.find, 500);

                bundle.sortBy = function (property) {
                    angular.forEach(bundle.sortProperties, function (sortProperty) {
                        sortProperty.enabled = false;
                    });
                    property.enabled = true;
                    property.asc = !property.asc;
                    bundle.filter.sortAsc = property.asc;
                    bundle.filter.sortProperty = property.name;
                    if (bundle.name == 'commentBundle'){
                        bundle.find();
                    }
                };

                bundle.selectOne = function () {
                    bundle.isSelectedAll = bundle.itemsList.every(function (user) {
                        return user.checked;
                    });
                };

                $state.commentBundle = bundle;
                return bundle;
            }
        }

        function createRubberBundle(nameBundle) {
            if (($state.rubberStudentBundle) && ($state.rubberStudentBundle.nameBundle === nameBundle)) {
                return $state.rubberStudentBundle;
            } else {
                if (($state.rubberOpenVacancyBundle) && ($state.rubberOpenVacancyBundle.nameBundle === nameBundle)) {
                    return $state.rubberOpenVacancyBundle;
                } else {
                    var bundle = {};

                    bundle.pageSize = 10;
                    bundle.isSelectAll = false;
                    bundle.clearItemsList = function () {
                        bundle.itemsList = [];
                    };
                    bundle.clearItemsList();
                    bundle.paging = {
                        totalCount: 0,
                        itemsPerPage: bundle.pageSize,
                        currentPage: 1,
                        visiblePages: 5
                    };

                    bundle.paging.onPageChanged = function (context) {
                        var state = {};
                        state['#page'] = bundle.paging.currentPage;
                        bundle.filter.from = (bundle.paging.currentPage - 1) * bundle.pageSize;
                        bundle.find(context);
                    };

                    bundle.sortProperties = {
                        firstName: {name: 'firstName', asc: true, enabled: true},
                        lastName: {name: 'lastName', asc: true, enabled: false},
                        email: {name: 'email', asc: true, enabled: false},
                        date: {name: 'date', asc: false, enabled: true}
                    };

                    bundle.filter = {
                        from: 0,
                        count: bundle.pageSize,// todo: extract to config
                        text: null,
                        group: (nameBundle === 'STUDENT_BUNDLE') ? 'students' : null,
                        sortProperty: null,
                        sortAsc: true
                    };
                    bundle.filter.sortProperty = bundle.sortProperties.firstName.name;
                    bundle.filter.sortAsc = bundle.sortProperties.firstName.asc;

                    bundle.find = function find(context) {
                        if (nameBundle === 'VACANCY_ON_DASHBOARD_BUNDLE') {
                            bundle.filter.displayedPeriodStart = context.dashboardPeriod.start.getTime();
                            bundle.filter.displayedPeriodEnd = context.dashboardPeriod.end.getTime();
                        }
                        resetBundleState(bundle);
                        angular.forEach(bundle.filter, function (value, key) {
                            if (angular.isString(value)) {
                                bundle.filter[key] = value ? value : null;
                            }
                        });
                        bundle.performSeach(bundle.filter).then(function (response) {
                            bundle.itemsList = response.data.data;
                            bundle.paging.totalCount = response.data.totalCount;
                            context.searchStudentBundle.unreadComments = response.data.countUnreadComments;
                            if (context != null && context.gridsterItems != null) {
                                context.gridsterItems.forEach(function (item) {
                                    var paginationPlace = (bundle.paging.totalCount > bundle.paging.itemsPerPage) ? 7 : 5;
                                    if ((item.dashName === 'student') && (nameBundle === 'STUDENT_BUNDLE')) {
                                        item.config.sizeY = response.data.data.length + paginationPlace;
                                        context.managerGridsterItems.forEach(function (managerItem) {
                                            if ((managerItem.name === 'Students') && (nameBundle === 'STUDENT_BUNDLE')) {
                                                managerItem.config.sizeY = response.data.data.length + paginationPlace;
                                            }
                                        });
                                        if (response.data.data.length > 0) {
                                            item.visible = true;
                                        } else {
                                            item.visible = false;
                                        }
                                    } else {
                                        if ((item.dashName === 'openVacancy') && (nameBundle === 'VACANCY_ON_DASHBOARD_BUNDLE')) {
                                            item.config.sizeY = response.data.data.length + paginationPlace;
                                            context.managerGridsterItems.forEach(function (managerItem) {
                                                if ((managerItem.name === 'Opened vacancies') && (nameBundle === 'VACANCY_ON_DASHBOARD_BUNDLE')) {
                                                    managerItem.config.sizeY = response.data.data.length + paginationPlace;
                                                }
                                            });
                                            if (response.data.data.length > 0) {
                                                item.visible = true;
                                            } else {
                                                item.visible = false;
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    };
                    bundle.typing = util.createDelayTypingListener(bundle.find, 500);

                    bundle.sortBy = function (property, context) {
                        angular.forEach(bundle.sortProperties, function (sortProperty) {
                            sortProperty.enabled = false;
                        });
                        property.enabled = true;
                        property.asc = !property.asc;
                        bundle.filter.sortAsc = property.asc;
                        bundle.filter.sortProperty = property.name;
                        bundle.find(context);
                    };

                    bundle.selectOne = function () {
                        bundle.isSelectedAll = bundle.itemsList.every(function (user) {
                            return user.checked;
                        });
                    };

                    if (nameBundle === 'STUDENT_BUNDLE') {
                        $state.rubberStudentBundle = bundle;
                    }
                    if (nameBundle === 'VACANCY_ON_DASHBOARD_BUNDLE') {
                            $state.rubberOpenVacancyBundle = bundle;
                    }
                    return bundle;
                }
            }
        }



        function setPageSize(bundle, pageSize) {
            bundle.pageSize = pageSize;
            bundle.paging.itemsPerPage = pageSize;
            bundle.filter.from = (bundle.paging.currentPage - 1) * bundle.pageSize;
            bundle.filter.count = bundle.pageSize;
            return pageSize;
        }

        function showStudentComments(contact, context) {
            context.searchCommentBundle = getCommentBundle(contact.id);
            context.searchCommentBundle.performSeach(context.searchCommentBundle.filter).then(function (response) {
                context.searchCommentBundle.itemsList = response.data.data;
                var index = -1;
                angular.forEach(context.searchCommentBundle.itemsList, function () {
                    index = index + 1;
                    if (context.searchCommentBundle.itemsList[index] != null) {
                        context.searchCommentBundle.itemsList[index].selected = false;
                    }
                });
                if (context.searchCommentBundle.itemsList[0] != null) {
                    context.searchCommentBundle.itemsList[0].selected = true;
                }
                context.searchCommentBundle.paging.totalCount = response.data.totalCount;
                dashboardService.openCommentsView('Comments', context).then(function () {

                });
            });
        }

        function showUnreadComments(context) {
            context.searchCommentBundle = getUnreadCommentBundle();
            context.searchCommentBundle.performSeach(context.searchCommentBundle.filter).then(function (response) {
                context.searchCommentBundle.itemsList = response.data.data;
                var index = -1;
                angular.forEach(context.searchCommentBundle.itemsList, function () {
                    index = index + 1;
                    if (context.searchCommentBundle.itemsList[index] != null) {
                        context.searchCommentBundle.itemsList[index].selected = false;
                    }
                });
                if (context.searchCommentBundle.itemsList[0] != null) {
                    context.searchCommentBundle.itemsList[0].selected = true;
                }
                context.searchCommentBundle.paging.totalCount = response.data.totalCount;
                dashboardService.openUnreadComments('Comments', context).then(function () {
                    dashboardService.setCountUnreadCommentsInZero();
                });
            });
        }

        function setContactId(bundle, contactId) {
            bundle.filter.id = contactId;
            return contactId;
        }

        function userPredicate(user) {
            return !$filter('isCurrentUser')(user);
        }

    }
})();

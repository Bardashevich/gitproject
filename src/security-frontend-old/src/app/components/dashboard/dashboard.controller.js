(function () {
    'use strict';

    angular
        .module('crm.dashboard')
        .controller('DashboardController', dashboardController);

    /** @ngInject */
    function dashboardController(dashboardService, $state, gridsterService, gridManagerService, customChartService,
                                 dateService, dialogService, $cookies, searchService, contactCommentService, contactSecurityService) {
        var vm = this;
        vm.searchStudentBundle = searchService.studentMode();
        vm.searchOpenVacancyBundle = searchService.vacancyOnDashboardMode();
        vm.addComment = addComment;
        vm.viewComments = viewComments;
        vm.viewUnreadComments = viewUnreadComments;
        vm.addStudent = addStudent;
        vm.editStudent = edit;

        vm.manageDashboards = manageDashboards;
        vm.restoreToDefaultManageDashboards = restoreToDefaultManageDashboards;
        vm.editVacancy = customChartService.editVacancy;
        vm.viewDashboards = viewDashboards;
        vm.openDash = openDash;
        vm.closeDash = closeDash;
        vm.closeManagerDash = closeManagerDash;
        vm.changeVisiblePeriod = changeVisiblePeriod;
        vm.periodStartOptions = {
            minDate: new Date(dateService.getFirstDateOfPreviousMonth(11)),
            maxDate: new Date(dateService.getLastDateOfCurrentMonth()),
            showWeeks: false,
            maxMode: 'day'
        };
        vm.periodEndOptions = {
            minDate: new Date(dateService.getFirstDateOfPreviousMonth(11)),
            maxDate: new Date(dateService.getLastDateOfCurrentMonth()),
            showWeeks: false,
            maxMode: 'day'
        };
        vm.gridsterItems = [];
        vm.gridsterItemsBuffer = [];
        vm.managerGridsterItems = [];

        init(vm);

        function init(context) {
            if ($cookies.get('startDate') && $cookies.get('endDate')){
                context.dashboardPeriod = {
                    start : new Date($cookies.get('startDate')),
                    end : new Date($cookies.get('endDate'))
                };
            }else {
                context.dashboardPeriod = {
                    start: dateService.getFirstDateOfPreviousMonth(),
                    end: dateService.getLastDateOfCurrentMonth()
                };
            }
            gridsterService.initGrid();
            gridsterService.loadGridsterItems(context);
            gridManagerService.loadManagerGridItems(context);
        }

        function edit(student) {
            contactSecurityService.checkReadPermission(student.id).then(function () {
                $state.go('contacts.edit', {id: student.id, group: 'students'});
            });
        }

        function viewComments(contact) {
                searchService.showStudentComments(contact, vm);
        }

        function viewUnreadComments() {
            searchService.showUnreadComments(vm);
        }

        function addComment(contact) {
            contactCommentService.addStudentComment(contact);
        }

        function addStudent() {
            $state.go('contacts.add', {group: 'students'});
        }

        function manageDashboards() {
            gridManagerService.loadManagerGridItems(vm);
            $state.go('manager');
        }

        function restoreToDefaultManageDashboards() {
            gridManagerService.editManagerGridItems(vm);
        }

        function viewDashboards() {
            var MAX_ROW_ON_DASHBOARD = 17;
            vm.managerGridsterItems.forEach(function (elem) {
                dashboardService.updateDashItem({
                    id: elem.id,
                    name: elem.panelTitle,
                    col : elem.config.col,
                    row : elem.config.row / MAX_ROW_ON_DASHBOARD + (elem.config.row % MAX_ROW_ON_DASHBOARD > 0),
                    visible: elem.visible});
            });
            gridsterService.loadGridsterItems(vm);
            $state.go('dashboards');
        }

        function closeDash(item) {
            var MAX_ROW_ON_DASHBOARD = 17;
            item.panelStyle = 'panel panel-danger';
            item.visible = false;
            vm.gridsterItemsBuffer.forEach(function (elem) {
                if (item.id === elem.id) {
                    elem.name = item.name;
                    elem.config = item.config;
                    elem.visible = item.visible;
                    dashboardService.updateDashItem({
                        id: item.id,
                        name: item.panelTitle,
                        col : item.config.col,
                        row : item.config.row / MAX_ROW_ON_DASHBOARD + (elem.config.row % MAX_ROW_ON_DASHBOARD > 0),
                        visible: item.visible
                    });
                } else {
                    dashboardService.updateDashItem({
                        id: elem.id,
                        name: elem.panelTitle,
                        col : elem.config.col,
                        row : elem.config.row / MAX_ROW_ON_DASHBOARD + (elem.config.row % MAX_ROW_ON_DASHBOARD > 0),
                        visible: elem.visible
                    });
                }
            });
            vm.gridsterItems.forEach(function (elem, index) {
                if (item === elem) {
                    vm.gridsterItems.splice(index, 1);
                }
            });
        }

        function closeManagerDash(item) {
            item.panelStyle = 'panel panel-danger';
            item.visible = false;
        }

        function openDash(item) {
            item.panelStyle = 'panel panel-success';
            item.visible = true;
        }

        function changeVisiblePeriod() {
            openDatePeriodDialog().then(function (model) {
                vm.dashboardPeriod.start = model.startDate;
                vm.dashboardPeriod.end = model.endDate;
                $cookies.put('startDate', model.startDate);
                $cookies.put('endDate', model.endDate);
                init(vm);
            });
        }

        function openDatePeriodDialog() {
            var detailsUrl = 'app/common/directives/period-picker/crm-period-picker-view.html';
            return dialogService.custom(detailsUrl, {
                size: 'md',
                startDate: vm.dashboardPeriod.start,
                endDate: vm.dashboardPeriod.end,
                periodStartOptions : {
                minDate: dateService.getFirstDateOfPreviousMonth(11),
                maxDate: dateService.getLastDateOfCurrentMonth(),
                showWeeks: false,
                maxMode: 'day'
            },
            periodEndOptions : {
                minDate: dateService.getFirstDateOfPreviousMonth(11),
                maxDate: dateService.getLastDateOfCurrentMonth(),
                showWeeks: false,
                maxMode: 'day'
            }
            }).result;
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('crm.dashboard')
        .factory('gridManagerService', gridManagerService);

    /** @ngInject */
    function gridManagerService(dashboardService, customChartService, highChartService) {
        var GRIDSTER_MAX_SIZE_Y = 17;
        return {
            loadManagerGridItems: loadManagerGridItems,
            editManagerGridItems: editManagerGridItems
        };

        function editManagerGridItems(context) {
            dashboardService.getDefaultDashboardsList().then(function (response) {
                response.data.forEach(function (element) {
                    context.managerGridsterItems.forEach(function (item) {
                        if (element.id === item.id) {
                            item.visible = element.visible;
                            item.config.row = element.row * GRIDSTER_MAX_SIZE_Y;
                            item.config.col = element.col;
                        }
                    });
                });
                return true;
            })
        }

        function loadManagerGridItems(context) {
            var startDate = new Date();
            startDate.setFullYear(2017);
            startDate.setMonth(0);
            startDate.setDate(1);

            var endDate = new Date();
            endDate.setFullYear(2017);
            endDate.setMonth(0);
            endDate.setDate(31);

            dashboardService.getDashboardsList().then(function (response) {
                context.managerGridsterItems = [];
                response.data.forEach(function (element) {
                    context.managerGridsterItems.push({
                        id: element.id,
                        panelTitle: element.name,
                        visible: element.visible,
                        config: {row: element.row * GRIDSTER_MAX_SIZE_Y, col: element.col},
                        panelStyle: (element.visible ? 'panel panel-success' : 'panel panel-danger'),
                        name: element.name,
                        dashName: 'manager'
                    });
                });
            }).then(function () {
                context.managerGridsterItems.forEach(function (item) {
                    switch (item.id) {
                        case 1: {
                            item.chartConfig = highChartService.getOpportunitiesStatusChart(getOpportunitiesStatusChartData(), {
                                start: startDate,
                                end: endDate
                            });
                            item.config.sizeX = 2;
                            item.config.sizeY = GRIDSTER_MAX_SIZE_Y;
                            break;
                        }
                        case 2: {
                            item.chartConfig = highChartService.getVacanciesProgressChart(getVacanciesProgressChartData());
                            item.config.sizeX = 1;
                            item.config.sizeY = GRIDSTER_MAX_SIZE_Y;
                            break;
                        }
                        case 3: {
                            item.customData = customChartService.getManagerOpenedVacanciesTable();
                            item.config.sizeX = 2;
                            item.config.sizeY = GRIDSTER_MAX_SIZE_Y;
                            break;
                        }
                        case 4: {
                            item.chartConfig = highChartService.getOpportunityStatisticsChart(getOpportunityStatisticsChartData());
                            item.config.sizeX = 1;
                            item.config.sizeY = GRIDSTER_MAX_SIZE_Y;
                            break;
                        }

                        case 5: {
                            item.customData = customChartService.getManagerStudentsTable();
                            item.config.sizeX = 2;
                            item.config.sizeY = GRIDSTER_MAX_SIZE_Y;
                            break;
                        }
                    }
                });
            });
        }

        function getOpportunitiesStatusChartData() {
            return [
                ['2017-01-04','CANDIDATE_REJECT',5],
                ['2017-01-06','CONSIDER',9],
                ['2017-01-02','CONTACT',7],
                ['2017-01-09','IGNORED',1],
                ['2017-01-03','PRELIMINARY_INTEVIEW',2],
                ['2017-01-19','SKIP',4],
                ['2017-01-26','ITERVIEW_SCHEDULED',5],
                ['2017-01-07','MAKE_OFFER',3],
                ['2017-01-03','SCHEDULE_ITERVIEW',4],
                ['2017-01-29','ACCEPT',7],
                ['2017-01-25','MANAGER_REVIEW',5]
            ];
        }

        function getVacanciesProgressChartData() {
            return [
                [5, 'opened'],
                [10, 'closed'],
                [8, 'inProgress']
            ];
        }

        function getOpportunityStatisticsChartData() {
            return [
                ['ACCEPT', 2],
                ['MAKE_OFFER', 3],
                ['ITERVIEW_SCHEDULED', 5],
                ['MANAGER_REVIEW', 8],
                ['CONTACT', 15]
            ];
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('crm.dashboard')
        .factory('gridsterService', gridsterService);

    /** @ngInject */
    function gridsterService(dashboardService, gridsterConfig, customChartService, vacancyOpportunitiesService, highChartService,
                             vacancyService) {
        return {
            initGrid: initGrid,
            loadGridsterItems: loadGridsterItems
        };

        function initGrid() {
            gridsterConfig.columns = 2;
            gridsterConfig.maxSizeX = 2;
            gridsterConfig.maxSizeY = 17;
            gridsterConfig.swapping = false;
            gridsterConfig.rowHeight = 30;
            gridsterConfig.colWidth = 565;
            gridsterConfig.mobileModeEnabled = true;
            gridsterConfig.mobileBreakPoint = 1130;
            gridsterConfig.resizable = {
                enabled: false,
                handles: ['s', 'e', 'n', 'w']
            };
            gridsterConfig.draggable = {
                enabled: true,
                handle: '.panel-heading-drag'
            };
        }

        function loadGridsterItems(context) {
            var itemArray = [];
            var gridsterMaxSizeY = 17;
            dashboardService.getDashboardsList().then(function (response) {
                context.gridsterItems = [];
                response.data.forEach(function (element) {
                    if (element.visible){
                        itemArray.push({
                            id: element.id,
                            panelTitle: element.name,
                            visible: element.visible,
                            config: {row: element.row * gridsterMaxSizeY, col: element.col},
                            panelStyle: 'panel panel-info',
                            dashName: (element.id == '5') ? 'student' : (element.id == '3') ? 'openVacancy' : 'dashBoard'
                        });
                    }
                });
            }).then(function () {
                itemArray.forEach(function (item) {
                    switch (item.id) {
                        case 1: {
                            context.gridsterItemsBuffer.push(item);
                            if (item.visible){
                                vacancyOpportunitiesService.getOpportunityStatusesByDate(context.dashboardPeriod).then(function (response) {
                                    if (response.data.length > 0) {
                                        item.chartConfig = highChartService.getOpportunitiesStatusChart(response.data, context.dashboardPeriod);
                                        context.gridsterItems.push(item);
                                    }
                                });
                            }
                            item.config.sizeX = 2;
                            item.config.sizeY = 17;
                            break;
                        }
                        case 2: {
                            context.gridsterItemsBuffer.push(item);
                            if (item.visible){
                                vacancyService.countVacanciesByStatus(context.dashboardPeriod).then(function (response) {
                                    if (response.data.length > 0) {
                                        item.chartConfig = highChartService.getVacanciesProgressChart(response.data);
                                        context.gridsterItems.push(item);
                                    }
                                });
                            }
                            item.config.sizeX = 1;
                            item.config.sizeY = 17;
                            break;
                        }
                        case 3: {
                            context.gridsterItemsBuffer.push(item);
                            if (item.visible){
                                context.searchOpenVacancyBundle.performSeach(context.searchOpenVacancyBundle.filter).then(function (response) {
                                    if (response.data.data.length > 0) {
                                        context.gridsterItems.push(item);
                                        item.config.sizeY = response.data.data.length + 7;
                                    }
                                });
                                context.searchOpenVacancyBundle.find(context);
                                item.customData = customChartService.getOpenedVacanciesTable(context);
                            }
                            item.config.sizeX = 2;
                            break;
                        }
                        case 4: {
                            context.gridsterItemsBuffer.push(item);
                            if (item.visible){
                                vacancyOpportunitiesService.getOpportunityStatistics(context.dashboardPeriod).then(function (response) {
                                    if (response.data.length > 0) {
                                        item.chartConfig = highChartService.getOpportunityStatisticsChart(response.data);
                                        context.gridsterItems.push(item);
                                    }
                                });
                            }
                            item.config.sizeX = 1;
                            item.config.sizeY = 17;
                            break;
                        }
                        case 5: {
                            context.gridsterItemsBuffer.push(item);
                            if (item.visible){
                                context.searchStudentBundle.find(context);
                                item.customData = customChartService.getStudentsTable(context);
                                context.gridsterItems.push(item);
                            }
                            item.config.sizeX = 2;
                            break;
                        }
                    }
                });
            });
        }

    }
})();

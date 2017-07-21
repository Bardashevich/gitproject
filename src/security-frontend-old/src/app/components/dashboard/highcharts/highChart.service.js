(function () {
    'use strict';

    angular
        .module('crm.dashboard')
        .factory('highChartService', highChartService);

    /** @ngInject */
    function highChartService(dateService, $filter) {
        return {
            getVacanciesProgressChart: getVacanciesProgressChart,
            getOpportunitiesStatusChart: getOpportunitiesStatusChart,
            getOpportunityStatisticsChart: getOpportunityStatisticsChart

        };

        function getVacanciesProgressChart(data) {
            var count = {};
            data.forEach(function (arr) {
                count[arr[1]] = arr[0];
            });
            return {
                options: {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: false,
                            innerSize: '45%',
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    legend: {
                        labelFormatter: function () {
                            return this.name + ' (' + this.y + ')';
                        },
                        verticalAlign: 'bottom',
                        align: 'center',
                        enabled: true,
                        layout: 'horizontal'
                    }
                },
                series: [{
                    name: 'Count',
                    colorByPoint: true,
                    data: [{
                        name: 'Opened',
                        y: count.opened || 0
                    }, {
                        name: 'Closed',
                        y: count.closed || 0
                    }, {
                        name: 'In progress',
                        y: count.inProgress || 0
                    }]
                }]
            };
        }

        function getOpportunitiesStatusChart(data, period) {
            var statusData = {};
            data.forEach(function (arr) {
                var statusKeyName = arr[1].toLowerCase().replace(new RegExp('_', 'g'), ' ');
                statusKeyName = statusKeyName.charAt(0).toUpperCase() + statusKeyName.slice(1);
                if (!statusData[arr[0]]){
                    statusData[arr[0]] = {};
                    statusData[arr[0]][statusKeyName] = arr[2];
                } else {
                    statusData[arr[0]][statusKeyName] = arr[2];
                }
            });
            var series = [];
            var categories = [];
            var statusMap = {};
            for (var date in statusData){
                for (var status in statusData[date]){
                    if (!statusMap[status]){
                        statusMap[status] = [];
                        series.push({
                            name: status,
                            data: [],
                            marker: {
                                enabled: false
                            },
                            type : 'spline',
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 3
                                }
                            }
                        });
                    }
                }
            }
            var startDate = new Date(period.start.getTime());
            var endDate = new Date(period.end.getTime());
            while (startDate <= endDate){
                var dateKey = dateService.getFormattedDate(startDate);
                var count;
                if (statusData[dateKey]){
                    for (var statusKey in statusMap) {
                        count = statusData[dateKey][statusKey] || 0;
                        statusMap[statusKey].push(count);
                    }
                    categories.push(($filter('date')(startDate, 'MMM-dd')));
                } else {
                    for (statusKey in statusMap){
                        statusMap[statusKey].push(0);
                    }
                    categories.push(($filter('date')(startDate, 'MMM-dd')));
                }

                var newDate = startDate.setDate(startDate.getDate() + 1);
                startDate = new Date(newDate);
            }

            series.forEach(function (seriesItem) {
                seriesItem.data = statusMap[seriesItem.name];
            });

            return {
                size: {
                  width: 1100
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: 'All vacancies'
                },
                xAxis: {
                    categories : categories,
                    title: {
                        text: ''
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                yAxis: [{
                    title: {
                        text: 'Count'
                    },
                    plotLines: [{
                        color: '#808080'
                    }]
                }],
                tooltip: {
                    shared: true,
                    pointFormat: '{series.name}: <b>{point.y}</b>'
                },
                series: series
            };
        }

        function getOpportunityStatisticsChart(data) {
            var statusData = {};
            data.forEach(function (arr) {
                statusData[arr[0]] = arr[1];
            });
            var rawSeriesData = [
                ['Offer accepted', (statusData.ACCEPT || 0)],
                ['Make offer', (statusData.MAKE_OFFER || 0)],
                ['Interview Scheduled', (statusData.ITERVIEW_SCHEDULED || 0)],
                ['Send Manager for Review', (statusData.MANAGER_REVIEW || 0)],
                ['Contact Attempt', (statusData.CONTACT || 0)]
             ];
            for (var i = 1; i < rawSeriesData.length; i++) {
                rawSeriesData[i][1] += rawSeriesData[i - 1][1];
            }

            var seriesData = [];
            for (var j = rawSeriesData.length - 1; j >= 0; j--) {
                if (rawSeriesData[j][1]){
                    seriesData.push(rawSeriesData[j]);
                }
            }
            return {
                options: {
                    chart: {
                        type: 'funnel'
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>'
                    },
                    plotOptions: {
                        funnel: {
                            neckWidth: '0%',
                            neckHeight: '0%',
                            height: '100%',
                            width: '70%',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true,
                            cursor: 'pointer'
                        }
                    },
                    legend: {
                        labelFormatter: function () {
                            return this.name + ' (' + this.y + ')';
                        },
                        verticalAlign: 'bottom',
                        align: 'center',
                        enabled: true,
                        layout: 'horizontal',
                        itemDistance: 70
                    }
                },

                series: [{
                    name: 'count',
                    data: seriesData
                }]
            };
        }

    }
})();

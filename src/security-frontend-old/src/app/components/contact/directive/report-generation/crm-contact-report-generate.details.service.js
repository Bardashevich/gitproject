(function () {
    'use strict';

    angular
        .module('crm.contact')
        .factory('contactReportGeneratorDetailsService', contactReportGeneratorDetailsService);

    /** @ngInject */
    function contactReportGeneratorDetailsService(dialogService, contactReportGeneratorService) {

        var detailService = 'app/components/contact/directive/report-generation/crm-contact-report-generation.modal.view.html';

        return {
            generateReport: generateReport,
            generateReports: generateReports
        };

        function generateReport(scope) {
            var checkedItems = [];
            checkedItems.push(scope.contact.id);
            openReportGenerateDialog(scope.dictionary, checkedItems);
        }

        function generateReports(dictionary, contacts) {
            var checkedItemsIds = contacts.map(function (contact) {
                return contact.id;
            });
            openReportGenerateDialog(dictionary, checkedItemsIds);
        }

        function openReportGenerateDialog(scope, checkedItemsIds) {
            return dialogService.custom(detailService, {
                title: 'Generate Report',
                size: 'modal--user-table',
                cancelTitle: 'Cancel',
                okTitle: 'Generate',
                checkedItemsIds: checkedItemsIds,
                reportGenerateBundle: createBundle(),
                fileTypes: scope.fileTypes
            }).result;
        }

        function createBundle() {
            var bundle = {};

            bundle.isSelectedAll = true;

            bundle.clearItemsList = function () {
                bundle.itemsList = [];
            };

            bundle.clearItemsList();

            bundle.selectOne = function () {
                bundle.isSelectedAll = bundle.itemsList.every(function (item) {
                    return item.checked;
                });
            };

            bundle.selectAll = function (isSelectedAll) {
                isSelectedAll = !isSelectedAll;
                var checkedValue = isSelectedAll ? false : true;
                bundle.itemsList.forEach(function (item) {
                    item.checked = checkedValue;
                });
            };

            bundle.createReports = function (checkedItemsIds, fileType) {
                bundle.clearItemsList();
                contactReportGeneratorService.getReports(checkedItemsIds, fileType).then(function (reports) {
                    initGeneratedReports(reports);
                });
            };

            bundle.download = function (fileType) {
                bundle.itemsList
                    .filter(function (item) {
                        return item.checked;
                    })
                    .forEach(function (item) {
                        contactReportGeneratorService.downloadFile(item.path, fileType, item.fileName);
                    });
            };

            function initGeneratedReports(reportsMap) {
                for (var key in reportsMap) {
                    var report = {};
                    report.fileName = fixNameSymbols(key);
                    report.path = reportsMap[key];
                    report.checked = true;
                    bundle.itemsList.push(report);
                }
            }

            function fixNameSymbols(name) {
                return name.replace('\\', ' ');
            }

            return bundle;
        }
    }
})();

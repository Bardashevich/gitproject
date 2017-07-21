(function () {
    'use strict';

    angular
        .module('crm.contact')
        .factory('contactReportGeneratorService', contactReportGeneratorService);

    /**@ngInject*/
    function contactReportGeneratorService($http, FileSaver) {
        return {
            getReports: getReports,
            downloadFile: downloadFile
        };

        function getReports(contacts, reportType) {
            var requestObj = {
                contactsId: contacts,
                reportType: reportType
            };
            return $http.post('rest/contacts/reports', requestObj).then(function (response) {
                return response.data;
            });
        }

        function downloadFile(path, fileType, filename) {
            return $http({
                method: 'GET',
                url: 'rest/files/download/',
                params: {
                    path: path,
                    fileType: fileType
                },
                responseType: 'arraybuffer'
            }).then(function (response) {
                var mimeType = 'application/' + fileType + ';charset=utf-8';
                var blob = new Blob([response.data], {type: mimeType});
                FileSaver.saveAs(blob, filename);
            });
        }
    }
})();

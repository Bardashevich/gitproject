(function () {
    'use strict';

    angular
        .module('crm')
        .constant('version', '${security.project.version}')
        .constant('MAX_FILE_SIZE', 104857600);
})();

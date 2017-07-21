/**
 * Created by artsiom.marenau on 1/31/2017.
 */
/**
 * Created by maksim.kalenik on 07.06.2016.
 */
(function () {
    'use strict';

    angular
        .module('crm.contact')
        .service('contactLanguageService', contactLanguageService);

    /** @ngInject */
    function contactLanguageService(dialogService) {

        var detailsUrl = 'app/components/contact/directive/general-info/languages/contact.language.details.view.html';

        var LANGUAGES = [
            {name: 'English', value: 'ENGLISH'},
            {name: 'Russian', value: 'RUSSIAN'},
            {name: 'Deutsch', value: 'DEUTSCH'}
        ];

        var LEVELS = [
            {name: 'Beginner', value: 'BEGINNER'},
            {name: 'Elementary', value: 'ELEMENTARY'},
            {name: 'Pre intermediate', value: 'PRE_INTERMEDIATE'},
            {name: 'Intermediate', value: 'INTERMEDIATE'},
            {name: 'Upper intermediate', value: 'UPPER_INTERMEDIATE'},
            {name: 'Advanced', value: 'ADVANCED'},
            {name: 'Proficiency', value: 'PROFICIENCY'}
        ];

        return {
            add: add,
            edit: edit,
            //remove: remove,
            getTypeName: getTypeName,
            getLanguages: getLanguages,
            getLevels: getLevels
        };

        function add(scope) {
            openAddDialog(scope).then(function (model) {
                scope.contact.languages.push(model.language);
            });
        }

        function edit(language, scope) {
            openEditDialog(language, scope).then(function (model) {
                angular.copy(model.language, language);
            });
        }
/*
        function remove(scope) {
            return contactCommonService.remove(scope.contact, scope.contact.languages, contactService.removeLanguage);
        }
*/

        function getLanguages() {
            return LANGUAGES;
        }

        function getLevels() {
            return LEVELS;
        }

        function getTypeName(value, types) {
            var result = null;
            types.forEach(function (o) {
                if (o.value == value) {
                    result = o.name;
                }
            });
            return result;
        }

        function openAddDialog(scope) {
            return dialogService.custom(detailsUrl, {
                title: 'Add Language',
                size: 'modal--user-table',
                cancelTitle: 'Cancel',
                okTitle: 'Add',
                language: {},
                languageNames: LANGUAGES,
                languageLevels: LEVELS
            }).result;
        }

        function openEditDialog(language, scope) {
            return dialogService.custom(detailsUrl, {
                title: 'Update Language',
                size: 'modal--user-table',
                cancelTitle: 'Cancel',
                okTitle: 'Save',
                language: angular.copy(language),
                languageNames: LANGUAGES,
                languageLevels: LEVELS
            }).result;
        }
    }
})();


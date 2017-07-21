(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .factory('vacancyDetailsService', vacancyDetailsService);
    /** @ngInject */
    function vacancyDetailsService(vacancyService, $state, $q, $stateParams,
                                   vacancySkillService, userService, contactService) {

        var HR_GROUP = 'HRs';
        var DEP_MANAGER_GROUP = 'DEPARTMENT_MANAGERs';
        var VACANCY_PRIORITY = 'MIDDLE';
        var LANGUAGE_LEVEL = 'Pre intermediate';
        var FOREING_LANGUAGE = 'English' ;

        return {
            submit: submit,
            cancel: cancel,
            getEmptyVacancy: getEmptyVacancy,
            skill: vacancySkillService,
            loadData : loadData
        };

        function getEmptyVacancy(context) {
            return {
                id : 0,
                openDate : Date.now(),
                vacancySkills : [],
                creator: context.vacancyCreator,
                foreignLanguage: FOREING_LANGUAGE,
                languageLevel: LANGUAGE_LEVEL,
                vacancyPriority : VACANCY_PRIORITY
            };
        }

        function loadData(context) {
            if (!contactService.hrListCache || !contactService.managersListCache || !userService.educationTypesCache){
                $q.all([
                    contactService.getContactsByUserGroup(HR_GROUP),
                    contactService.getContactsByUserGroup(DEP_MANAGER_GROUP),
                    userService.getEducationTypes(),
                    userService.getPriorities(),
                    contactService.getCurrentContact()
                ]).then(function (response) {
                    contactService.hrListCache = response[0].data;
                    contactService.managersListCache = response[1].data;
                    userService.educationTypesCache = response[2].data;
                    userService.prioritiesCache = response[3].data;
                    contactService.currentContactCache = response[4].data;
                    context.hrList = contactService.hrListCache;
                    context.managersList = contactService.managersListCache;
                    context.educationTypes = userService.educationTypesCache;
                    context.priorities = userService.prioritiesCache;
                    if (context.vacancy.id == 0) {
                        context.currentContact = contactService.currentContactCache;
                        response[1].data.forEach(function (manager) {
                            if (manager.id == response[4].data.id){
                                context.vacancyCreator = manager;
                            }
                        });
                        if (context.vacancyCreator == null) {
                            context.vacancyCreator = response[1].data[0];
                        }
                        context.vacancy = getEmptyVacancy(context);
                    }
                });
            } else {
                context.hrList = contactService.hrListCache;
                context.managersList = contactService.managersListCache;
                context.educationTypes = userService.educationTypesCache;
                context.priorities = userService.prioritiesCache;
                if (context.vacancy.id == 0) {
                    contactService.getCurrentContact().then(function (contact) {
                        contactService.managersListCache.forEach(function (manager) {
                            if (manager.id == contact.data.id){
                                context.vacancyCreator = manager;
                            }
                        });
                        if (context.vacancyCreator == null) {
                            context.vacancyCreator = contactService.managersListCache[0];
                        }
                        context.vacancy = getEmptyVacancy(context);
                    });
                }
            }
        }

        function submit(vacancy, isNew) {
            if (isNew) {
                vacancyService.create(vacancy).then(function () {
                    cancel();
                });
            } else {
                vacancyService.update(vacancy).then(function () {
                    cancel();
                });
            }
        }

        function cancel() {
            if ($stateParams.previousState) {
                $state.go($stateParams.previousState);
            } else {
                $state.go('vacancies.list');
            }
        }
    }
})();

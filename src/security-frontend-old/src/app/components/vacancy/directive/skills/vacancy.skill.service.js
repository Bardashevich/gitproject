(function () {
    'use strict';

    angular
        .module('crm.vacancy')
        .service('vacancySkillService', vacancySkillService);

    /** @ngInject */
    function vacancySkillService(vacancyService, dialogService) {

        var detailsUrl = 'app/components/vacancy/directive/skills/vacancy.skills.modal.view.html';
        var DEFAUL_SKILL_REQUIRED = true;
        return {
            add: add,
            edit: edit,
            remove: remove,
            isEmptySkills : isEmptySkills
        };

        function isEmptySkills(context) {
            if (!(context.vacancy.countSkills)){
                return true;
            }
            return false;
        }

        function add(scope) {
            openAddDialog().then(function (model) {
                var required = model.skill.required || false;
                var skillNames = model.skill.name.split(/\s*,\s*|\s*;\s*/);
                skillNames.forEach(function (skillName) {
                    scope.vacancy.vacancySkills.push({name: skillName, required : required});
                    scope.vacancy.countSkills =  (scope.vacancy.countSkills || false) + 1;
                });
            });
        }

        function edit(skill) {
            openEditDialog(skill).then(function (model) {
                skill.required = skill.required || false;
                angular.copy(model.skill, skill);
            });
        }

        function remove(skill, scope) {
            scope.vacancy.vacancySkills[scope.vacancy.vacancySkills.indexOf(skill)].dateDeleted = Date.now();
                scope.vacancy.countSkills = (scope.vacancy.countSkills || false) - 1;
                if (scope.vacancy.countSkills == 0) {
                    scope.vacancy.countSkills = null;
                }

        }

        function openAddDialog() {
            return dialogService.custom(detailsUrl, {
                title: 'Add Skill',
                size: 'modal--user-table',
                cancelTitle: 'Cancel',
                okTitle: 'Add',
                skill: {required: DEFAUL_SKILL_REQUIRED}
            }).result;
        }

        function openEditDialog(skill) {
            return dialogService.custom(detailsUrl, {
                title: 'Update Skill',
                size: 'modal--user-table',
                cancelTitle: 'Cancel',
                okTitle: 'Save',
                skill: angular.copy(skill)
            }).result;
        }
    }
})();

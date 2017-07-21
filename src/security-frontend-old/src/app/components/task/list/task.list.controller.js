(function () {
    'use strict';

    angular
        .module('crm.task')
        .controller('TaskListController', TaskListController);

    /** @ngInject */
    function TaskListController(taskService, taskSecurityService, dialogService, collections, searchService, $state, $q) {
        var vm = this;

        vm.bundle = searchService.getTaskBundle();
        vm.add = add;
        vm.edit = edit;
        vm.remove = remove;

        function add() {
            $state.go('tasks.add');
        }

        function edit(task) {
            taskSecurityService.checkEditPermission(task.id).then(function () {
                $state.go('tasks.edit', {id: task.id});
            });
        }

        function remove() {
            var checked = vm.bundle.itemsList.filter(collections.getChecked);
            if (checked.length > 0){
                dialogService.confirm('Do you want to delete the selected task(s)?').result.then(function () {
                    taskSecurityService.checkDeletePermissionForList(checked).then(function () {
                        $q.all(checked.map(collections.getId).map(taskService.remove)).then(vm.bundle.find);
                    });
                });
            }
        }

        (function () {
            vm.bundle.clearItemsList();
            vm.bundle.find();
        })();
    }

})();

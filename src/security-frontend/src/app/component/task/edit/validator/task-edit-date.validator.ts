import {TaskEditComponent} from "../task-edit.component";
export class TaskEditDateValidator {
  static endDateLessThanStartDate(taskEditComponent: TaskEditComponent) {
    return function(fc) {
      return !taskEditComponent.isTimeless && (new Date(taskEditComponent.startDate) <= new Date(taskEditComponent.endDate)) ?
        null : {
          'endDateLessThanStartDate': true
        };
    }
  }
}
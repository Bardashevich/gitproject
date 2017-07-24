import {
  Component, trigger, state, style, transition, animate, ViewChild, ElementRef
} from '@angular/core';
import {Router} from "@angular/router";
import {Task} from "../../../shared/models/task/task";
import {TaskService} from "../../../shared/services/tasks.service";
import {Observable} from "rxjs";
import any = jasmine.any;
import {DefaultGridComponent} from "../../common/def-grid/def-grid.component";
import {GridOptions} from "../../../shared/models/grid/grid-options";
import {GridHeaderOptions} from "../../../shared/models/grid/grid-header-options";
import {GridHeaderAction} from "../../../shared/models/grid/grid-header-action";
import {GridColumn} from "../../../shared/models/grid/grid-column";
import {TaskGridModel} from "../../../shared/models/task/task-grid";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'tasks',
  animations: [
    trigger('mode', [
      state('void', style({
        'transform': 'translateY(10%)',
        'opacity': '0'
      })),
      transition('void => settings', animate('0s')),
      transition('void => table', animate('.3s 0s cubic-bezier(0.175, 0.885, 0.32, 1.275)'))
    ]),
    trigger('enterFilterAnimation', [
      transition(':enter', [
        style({transform: 'translateY(-5%)', opacity: 0}),
        animate('.2s', style({transform: 'translateY(0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0)', opacity: 1}),
        animate('.2s', style({transform: 'translateY(-5%)', opacity: 0}))
      ])
    ])
  ],
  templateUrl: 'tasks.component.html',
  styleUrls: ['tasks.component.scss']
})
export class TasksComponent {
  @ViewChild(DefaultGridComponent) defGridComponent: DefaultGridComponent<TaskGridModel>;
  private gridOptions: GridOptions = new GridOptions;
  private gridHeaderOptions: GridHeaderOptions = new GridHeaderOptions;
  private datePipe: DatePipe;

  constructor(private router: Router, private taskService: TaskService) {
    this.datePipe = new DatePipe('en-US');
    this.initializeGrid();
  }

  initializeGrid() {
    this.gridHeaderOptions.title = 'Tasks';
    this.gridHeaderOptions.actions.push(
      new GridHeaderAction('delete', this.deleteTask.bind(this), true),
      new GridHeaderAction('library_add', this.addTask.bind(this), false)
    );

    this.gridOptions.doubleClickFunction = this.editTask.bind(this);
    this.gridOptions.afterProcessing = this.afterProcessing.bind(this);
    this.gridOptions.findFunction = this.taskService.find.bind(this.taskService);
    this.gridOptions.defaultSortProperty = 'name';
    this.gridOptions.columns.push(
      new GridColumn('Name', 'name', '15%', true, 'name'),
      new GridColumn('Created By', 'creatorFullName', '15%', false, ''),
      new GridColumn('Assignee To', 'assigneeFullName', '15%', false, ''),
      new GridColumn('Status', 'status', '13%', true, 'status'),
      new GridColumn('Priority', 'priority', '13%', true, 'priority'),
      new GridColumn('Start Date', 'startDate', '15%', true, 'startDate'),
      new GridColumn('End Date ', 'endDate', '14%', true, 'endDate')
    )
  }

  deleteTask() {
    let forkJoinArray: Array<Observable<any>> = this.defGridComponent.entities.filter(task => task.selected).map(value => this.taskService.delete(value.id));
    Observable.forkJoin(forkJoinArray).subscribe(response => this.defGridComponent.find());
  }

  editTask(task) {
    this.router.navigate([`tasks/${task.id}`]);
  }

  addTask() {
    this.router.navigate(['tasks/0']);
  }

  afterProcessing(tasks: Array<Task>) {
    let taskGridModels: Array<TaskGridModel> = [];
    tasks.forEach(task => {
      let taskModel = new TaskGridModel();
      taskModel.id = task.id;
      taskModel.name = task.name;
      taskModel.creatorFullName = `${task.creator.firstName} ${task.creator.lastName} (${task.creator.userName}`;
      taskModel.assigneeFullName = `${task.assignee.firstName} ${task.assignee.lastName} (${task.assignee.userName}`;
      taskModel.status = task.status.name;
      taskModel.priority = task.priority.name;
      if (task.startDate && task.endDate) {
        taskModel.startDate = this.datePipe.transform(task.startDate, 'y-MM-dd HH:mm');
        taskModel.endDate = this.datePipe.transform(task.endDate, 'y-MM-dd HH:mm');
      }
      taskGridModels.push(taskModel);
    });
    return taskGridModels;
  }
}

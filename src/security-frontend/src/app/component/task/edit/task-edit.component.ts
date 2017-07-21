import {
  Component, trigger, style, transition, animate, EventEmitter, ViewChild, OnInit
} from '@angular/core';
import {Task} from "../../../shared/models/task/task";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskService} from "../../../shared/services/tasks.service";
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {AclEntry} from "../../../shared/models/users/acl-entry";
import {NamedEntity} from "../../../shared/models/named-entity";
import {PublicUser} from "../../../shared/models/users/public-user";
import {UserService} from "../../../shared/services/users.service";
import "materialize-css";
import {MaterializeAction} from "angular2-materialize";
import {TaskEditDateValidator} from "./validator/task-edit-date.validator";
declare let Materialize: any;

@Component({
  selector: 'task-edit',
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({transform: 'translateY(5%)', opacity: 0}),
        animate('.2s', style({transform: 'translateY(0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0)', opacity: 1}),
        animate('.2s', style({transform: 'translateY(5%)', opacity: 0}))
      ])
    ])
  ],
  templateUrl: 'task-edit.html',
  styleUrls: ['task-edit.scss']
})
export class TaskEditComponent {

  private task: Task = new Task();
  private taskForm: FormGroup;
  private acls: Array<AclEntry> = [];
  startDate: string;
  endDate: string;
  isTimeless = false;

  private statuses: Array<NamedEntity>;
  private priorities: Array<NamedEntity>;
  private publicUsers: Array<PublicUser>;

  private contactsModalActions: EventEmitter<string|MaterializeAction>;
  private companiesModalActions: EventEmitter<string|MaterializeAction>;
  private showSpinner: boolean = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private userService: UserService,
              private taskService: TaskService) {
    let taskId = this.route.snapshot.params['taskId'];
    this.taskService.getStatuses().subscribe(response => this.statuses = response);
    this.taskService.getPriorities().subscribe(response => this.priorities = response);
    this.userService.getPublicUsers().subscribe(response => this.publicUsers = response);
    if (taskId && taskId != 0) {
      this.showSpinner = true;
      this.taskService.get(taskId).finally(() => this.showSpinner = false).subscribe(response => {
        this.task = response || this.task;      //TODO Change logic if task haven't found
        this.isTimeless = !(this.task.startDate && this.task.endDate);
        if (!this.isTimeless) {
          this.startDate = new Date(this.task.startDate).toString();
          this.endDate = new Date(this.task.endDate).toString();
        }
      });
      this.taskService.getAcls(taskId).subscribe(response => this.acls = response || this.acls);
    }
    this.task.startDate = new Date;
    this.contactsModalActions = new EventEmitter<string|MaterializeAction>();
    this.companiesModalActions = new EventEmitter<string|MaterializeAction>();

    this.taskForm = this.fb.group({
      inputGroup: this.fb.group({
        name: ['', Validators.required],
        location: ['', Validators.required],
        status: ['', Validators.required],
        priority: ['', Validators.required],
        assignee: ['', Validators.required],
        description: ['']
      }),
      dateGroup: this.fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      }, {validator: TaskEditDateValidator.endDateLessThanStartDate(this)})
    });
  }

  materialize(){
    if(Materialize &&  Materialize.updateTextFields){
      Materialize.updateTextFields();
    }
    return true;
  }

  toggleSelection(o) {
    o.selected = !o.selected;
  }

  toggleAll(array) {
    let selected = !this.isAllChecked(array);
    array.forEach(x => x.selected = selected);
  }

  isAllChecked(array) {
    return array && array.length > 0 && array.every(_ => _.selected);
  }

  isAnyChecked(array) {
    if (array) {
      return array.some(_ => _.selected);
    }
  }

  isAllPermissionsSelected(permissionsName) {
    return this.acls && this.acls.length > 0 && this.acls.every(p => p[permissionsName]);
  }

  togglePermissions(permissionsName) {
    let selected = !this.isAllPermissionsSelected(permissionsName);
    this.acls.forEach(p => p[permissionsName] = selected);
  }

  deleteContacts() {
    this.task.contacts = this.task.contacts.filter(contact => !contact.selected);
  }

  deleteCompanies() {
    this.task.companies = this.task.companies.filter(company => !company.selected);
  }

  save() {
    if (!this.isTimeless) {
      this.task.startDate = new Date(this.startDate);
      this.task.endDate = new Date(this.endDate);
    } else {
      this.task.startDate = null;
      this.task.endDate = null;
    }
    this.task.id ? this.taskService.update(this.task).subscribe(response => this.router.navigate(['/tasks.list']))
      : this.taskService.save(this.task).subscribe(response => this.router.navigate(['/tasks.list']));
  }
}

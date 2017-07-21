import {
  Component, trigger, state, style, transition, animate, ViewChild, ElementRef
} from '@angular/core';
import {SecuredUser} from "../../../shared/models/users/secured-user";
import {UserService} from "../../../shared/services/users.service";
import {UserFilter} from "../../../shared/models/users/user-filter";
import {RoleService} from "../../../shared/services/roles.service";
import {GroupService} from "../../../shared/services/groups.service";
import {Router} from "@angular/router";

@Component({
  selector: 'users',
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
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.scss']
})
export class UsersComponent {
  private totalCount: number;
  private userFilter: UserFilter;
  private roles: any[];
  private groups: any[];
  private selectActiveOptions: Array<any>;

  private users: Array<SecuredUser> = [];
  private COUNT_USER: number = 20;
  private countPage: number;
  private currentPage: number;
  private pageIndexes: Array<number>;

  @ViewChild('search') inputElement:ElementRef;
  hideSearchInput: boolean = true;
  showFilter: boolean = false;

  constructor(private router: Router, private userService: UserService, private roleService: RoleService, private groupService: GroupService) {
    this.userFilter = new UserFilter();
    this.currentPage = 1;
    this.selectActiveOptions = [{value: true, name: 'Active'}, {value: false, name: 'Inactive'}];
    this.roleService.getAll().subscribe(response => {
      this.roles = response;
    });
    this.groupService.getAll().subscribe(response => {
      this.groups = response;
    });
    this.find();
  }

  toggleInput() {
    this.hideSearchInput = !this.hideSearchInput;
    if (!this.hideSearchInput) {
      this.inputElement.nativeElement.focus();
    }
  }

  sortColumn(columnName) {
    if (this.userFilter.sortProperty == columnName) {
      this.userFilter.sortAsc = !this.userFilter.sortAsc;
    } else {
      this.userFilter.sortProperty = columnName;
      this.userFilter.sortAsc = true;
    }
    this.find();
  }

  toggleSelection(u) {
    u.selected = !u.selected;
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  toggleAll(ev) {
    let selected = !this.isAllChecked();
    this.users.forEach(x => x.selected = selected)
  }

  isAnyChecked() {
    if (this.users) {
      return this.users.some(_ => _.selected);
    }
  }

  get countSelectedItems() {
    return this.users.filter(_ => _.selected).length;
  }

  isAllChecked() {
    return this.users && this.users.length > 0 && this.users.every(_ => _.selected);
  }

  changePage(index) {
    this.currentPage = index;
    this.userFilter.from = (index - 1) * this.COUNT_USER;
    this.find();
  }

  applyTextFilter() {
    this.currentPage = 1;
    this.find();
  }

  activateSelectedUsers() {
    this.users.filter(value => value.selected).forEach(value => {
      this.userService.activate(value.id).subscribe();
    })
  }

  deactivateSelectedUsers() {
    this.users.filter(value => value.selected).forEach(value => {
      this.userService.deactivate(value.id).subscribe();
    })
  }

  editUser(user) {
    this.router.navigate([`users/${user.id}`]);
  }

  find() {
    this.userService.find(this.userFilter).subscribe(response => {
      this.users = response.data;
      this.totalCount = response.totalCount;
      this.countPage = (this.totalCount % this.COUNT_USER === 0 ? 0 : 1) + (this.totalCount / this.COUNT_USER | 0 );
      this.pageIndexes = (new Array(this.countPage)).fill(0).map((x,i) => i + 1);
      if (this.countPage < this.currentPage) {
        this.currentPage = this.countPage;
      }
    })
  }
}

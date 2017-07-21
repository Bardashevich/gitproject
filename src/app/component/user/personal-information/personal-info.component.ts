import {Component, style, animate, transition, trigger, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SecuredUser} from "../../../shared/models/users/secured-user";
import {UserService} from "../../../shared/services/users.service";
import {Group} from "../../../shared/models/users/group";
import {Role} from "../../../shared/models/users/role";
import {GroupService} from "../../../shared/services/groups.service";
import {RoleService} from "../../../shared/services/roles.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
declare let Materialize: any;

@Component({
  selector: 'user-personal-info',
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
  templateUrl: 'personal-info.component.html',
  styleUrls: ['personal-info.component.scss']
})
export class UserPersonalInfoComponent {
  private user: SecuredUser = new SecuredUser();
  private groups: Array<Group>;
  private roles: Array<Role>;
  private personalInfoForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private userService: UserService,
              private groupService: GroupService, private roleService: RoleService) {
    let userId = this.route.snapshot.params['userId'];

    this.userService.getById(userId).subscribe(response => {
      this.user = response;
      this.groupService.getAll().subscribe(response => {
        this.groups = response;
        this.user.groups.forEach(val => {
          this.groups.find(group => group.id === val.id).checked = true;
        });
      });
      this.roleService.getAll().subscribe(response => {
        this.roles = response;
        this.user.roles.forEach(val => {
          this.roles.find(role => role.id === val.id).checked = true;
        });
      });
      this.userService.getAcls(userId).subscribe(response => {
        this.user.acls = response;
      });
    });
    this.personalInfoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      userName: ['']
    });
  }

  materialize(){
    if(Materialize &&  Materialize.updateTextFields){
      Materialize.updateTextFields();
    }
    return true;
  }

  toggleActiveUser() {
    this.user.active = !this.user.active;
  }

  toggleSelection(o) {
    o.selected = !o.selected;
  }

  togglePermissionsAll(ev) {
    let selected = !this.isAllPermissionsChecked();
    this.user.acls.forEach(x => x.selected = selected);
  }

  isAllPermissionsChecked() {
    return this.user.acls && this.user.acls.length > 0 && this.user.acls.every(_ => _.selected);
  }

  isAllPermissionsSelected(permissionsName) {
    return this.user.acls && this.user.acls.length > 0 && this.user.acls.every(p => p[permissionsName]);
  }

  togglePermissions(permissionsName) {
    let selected = !this.isAllPermissionsSelected(permissionsName);
    this.user.acls.forEach(p => p[permissionsName] = selected);
  }

  save() {
    this.user.groups = this.groups.filter(value => value.checked);
    this.user.roles = this.roles.filter(value => value.checked);
    this.userService.update(this.user).subscribe(response => {
      this.router.navigate(['users.list']);
    }, error => {

    });
  }

}

import {
    Component, trigger, state, style, transition, animate, ViewChild, ElementRef,
    ViewEncapsulation, Input
} from '@angular/core';
import {SecuredUser} from "../../../../shared/models/users/secured-user";
import {UserService} from "../../../../shared/services/users.service";
import {UserFilter} from "../../../../shared/models/users/user-filter";
import {GroupService} from "../../../../shared/services/groups.service";
import {ContactsService, ContactDeleteEntity} from "../../../../shared/services/contacts.service";

@Component({
    selector: 'access-users',
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
    templateUrl: './access.component.html',
    styleUrls: ['./access.component.scss']
})
export class AccessComponent{
    @Input() acls;
    @Input() contactId;
    private userFilter: UserFilter;
    private groups: any[];

    private users: Array<SecuredUser> = [];
    showGroups = true;
    showUsers = true;
    showDefaultAccess = true;
    removeAcls: Array<any> = [];
    showCheckbox = false;
    editedAcls = false;
    canProps = [
        {
            field: 'canRead',
            name: 'Read'
        },
        {
            field: 'canWrite',
            name: 'Write'
        },
        {
            field: 'canCreate',
            name: 'Create'
        },
        {
            field: 'canDelete',
            name: 'Delete'
        },
        {
            field: 'canAdmin',
            name: 'Admin'
        }
        ];


    constructor(private userService: UserService, private groupService: GroupService, private contactsService: ContactsService) {
        this.userFilter = new UserFilter();
        this.groupService.getPublicGroups().subscribe(response => {
            this.groups = response;
        });
        this.find();
    }

    toggleSelection(u) {
        u.selected = !u.selected;
    }

    toggleAll(ev) {
        let selected = !this.isAllChecked();
        this.users.forEach(x => x.selected = selected)
    }

    isAnyChecked() {
        return this.users ? this.users.some(_ => _.selected) : false;
    }

    countSelectedItems(items) {
        if(items){
            return items.filter(_ => _.selected).length;
        } else
            return 0;
    }

    isAllChecked() {
        return this.users && this.users.length > 0 && this.users.every(_ => _.selected);
    }

    find() {
        this.userService.findPublicUsers(this.userFilter).subscribe(response => {
            this.users = response.data;
        })
    }

    togglePermissionsAll(ev) {
        let selected = !this.isAllPermissionsChecked();
        this.acls.forEach(x => x.selected = selected);
    }

    isAllPermissionsChecked() {
        return this.acls.every(_ => _.selected);
    }

    isAllPermissionsSelected(permissionsName) {
        return this.acls.every(p => p[permissionsName]);
    }

    togglePermissions(permissionsName) {
        let selected = !this.isAllPermissionsSelected(permissionsName);
        this.acls.forEach(p => p[permissionsName] = selected);
    }

    togglePermission(i, prop) {
        this.acls[i][prop] = !this.acls[i][prop];
        this.editedAcls = true;
    }


    mark(){
        this.showCheckbox = !this.showCheckbox;
    }

    isMark(){
        return this.showCheckbox;
    }

    addUsersPermissions(){
        let checkedUsers = this.users.filter(user => user.selected ? true : false);
        if (checkedUsers.length > 0) {
            for (let user of checkedUsers) {
                let isUser = true;
                this.acls.forEach(p => {
                    if (p.principalTypeName == 'user' && p.principalId == user.id){
                        isUser = false;
                    }
                });
                if(isUser){
                    this.acls.push(this.addDefaultPermissions(user.id, user.userName, 'user'));
                    this.editedAcls = true;
                }
            }
        }
    }

    addGroupsPermissions(){
        let checkedGroups = this.groups.filter(group => group.selected ? true : false);
        if (checkedGroups.length > 0) {
            for (let group of checkedGroups) {
                let isGroup = true;
                this.acls.forEach(p => {
                    if (p.principalTypeName == 'group' && p.principalId == group.id){
                        isGroup = false;
                    }
                });
                if(isGroup){
                    this.acls.push(this.addDefaultPermissions(group.id, group.name, 'group'));
                    this.editedAcls = true;
                }
            }
        }
    }

    addDefaultPermissions(principalId, name, principalTypeName):any {
        return {
            id: null,
            principalId: principalId,
            name: name,
            principalTypeName: principalTypeName,
            canRead: false,
            canWrite: false,
            canCreate: false,
            canDelete: false,
            canAdmin: false
        }
    }

    remove(){
        let selectedPermissions = this.acls.filter(permission => permission.selected ? true : false);
        selectedPermissions.forEach(p => {
                if(p.principalId && p.principalId != 0){
                    this.removeAcls.push(p);
                    this.editedAcls = true;
                    this.acls.splice(this.acls.indexOf(p), 1);
                }else{
                    this.acls.splice(this.acls.indexOf(p), 1);
                }
            });
        this.showCheckbox = !this.showCheckbox;
    }

    isEditedPermissions(){
        return this.editedAcls;
    }

    save(){
        this.contactsService.createOrUpdateAcls(this.contactId, this.acls).subscribe(response =>{});
        this.removeAcls.forEach(p => {
            this.contactsService.deleteContactEntity(this.contactId, p.principalId, ContactDeleteEntity.Acl).subscribe(response => {
            });
        });
        this.editedAcls = false;
    }

}

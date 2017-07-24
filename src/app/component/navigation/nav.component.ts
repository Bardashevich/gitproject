import {AuthService} from "../../shared/services/auth.service";
import {Component, trigger, state, style, transition, animate, Output, EventEmitter} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: 'nav-template',
    animations: [
        trigger('nav', [
            state('void', style({
                'opacity': '0'
            })),
            transition('* <=> *', animate('.3s 0s cubic-bezier(0.175, 0.885, 0.32, 1.275)'))
        ])
    ],
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent {
    @Output() update = new EventEmitter();
    activeTab;
    isInverse;
    colorClass;
    roles = ['MANAGER', 'SPECIALIST',  'ADMIN'];
    roleAccess = [
        [ this.roles[0], this.roles[1]],
        [ this.roles[2] ]
    ];
    tabs = [
        [
            'Dashboard',
            this.roleAccess[0],
            '/dashboard'
        ],
        [
            'Contacts',
            this.roleAccess[0],
            '/contacts.list'
        ],
        [
            'Companies',
            this.roleAccess[0],
            '/companies.list'
        ],
        [
            'Tasks',
            this.roleAccess[0],
            '/tasks.list'
        ],
        [
            'Vacancies',
            this.roleAccess[0],
            '/vacancies.list'
        ],
        [
            'Users',
            this.roleAccess[1],
            '/users.list'
        ],
        [
            'Groups',
            this.roleAccess[1],
            '/groups.list'
        ],
        [
            'Roles',
            this.roleAccess[1],
            '/roles.list'
        ]
    ];

    showDropdownProfile;

    constructor(private router: Router, private authService: AuthService) {
        this.showDropdownProfile = false;
        this.colorClass = 'light-blue';
        this.isInverse = true;
    }

    setTab(tab) {
        this.activeTab = tab;
    }

    toggleDropdownProfile() {
        this.showDropdownProfile = !this.showDropdownProfile;
    }

    userIsLogged():boolean {
        return this.authService.isAuthenticated();
    }

    userHasAnyRole(roles: Array<string>): boolean {
        let user = this.authService.getUser();
        if (this.authService.isAuthenticated()) {
            for (let i = 0; i < roles.length; i++) {
                if (this.hasRole(roles[i], user)) {
                    return true;
                }
            }
        }
        return false;
    }

    private hasRole(role, user): boolean{
        return !!user
          && user.roles
          && user.roles.indexOf(role) !== -1;
    }

    getClassForUrl(url: string): string {
        if (this.router.url === url){
            return 'active';
        }
        return '';
    }

    getUserName(): string{
        let user = this.authService.getUser();
        return user ? user.username : '';
    }

    getUserPhotoUrl(): string {
        let user = this.authService.getUser();
        return user ? user.avatar : '';
    }

    passColor(colorClass) {
        this.update.emit({colorClass: colorClass});
    }

    toggleInverse() {
        this.isInverse = !this.isInverse;
    }

    applyColor(colorClass) {
        this.colorClass = colorClass;
    }
}
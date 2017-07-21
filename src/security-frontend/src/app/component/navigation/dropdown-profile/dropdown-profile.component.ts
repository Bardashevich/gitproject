import {Component, trigger, state, style, transition, animate, Input, Output, EventEmitter} from "@angular/core";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
@Component({
    selector: 'dropdown-profile',
    animations: [
        trigger('dropdown', [
            state('void', style({
                'transform': 'scale(.4) translateY(0px) translateX(15px)',
                'opacity': '0'
            })),
            transition('* <=> *', animate('.1s 0s ease-out'))
        ])
    ],
    templateUrl: './dropdown-profile.component.html',
    styleUrls: ['./dropdown-profile.component.scss']
})
export class DropdownProfileComponent {
    @Input() showDropdownProfile;
    @Output() showDropdownProfileChange = new EventEmitter<string>();

    onNameChange(model) {
        this.showDropdownProfile = model;
        this.showDropdownProfileChange.emit(model);
    }

    user;

    constructor(private authService: AuthService, private router: Router) {
        this.user = this.getUserName();
    }

    getUserName() {
        let user = this.authService.getUser();
        return user ? user : null;
    }

    logout(): void {
        this.onNameChange(false);
        this.authService.logout().subscribe(response => {
            this.router.navigate(['login']);
        });
    }
}

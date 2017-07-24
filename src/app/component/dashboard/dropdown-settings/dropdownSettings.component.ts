import {Component, Input} from '@angular/core';
import {MenuItem} from "./menuItem";
import set = Reflect.set;


@Component({
    selector: 'dropdown-settings',
    templateUrl: 'dropdownSettings.html'
})
export class DropdownSettingsComponent {
    @Input() items: MenuItem;
    @Input() itemId: number;
}
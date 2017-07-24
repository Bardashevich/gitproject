import {Component, EventEmitter, Output} from "@angular/core";

@Component({
    selector: 'logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
    @Output() update = new EventEmitter();

    colorClass;
    colorClasses = ['light-blue', 'blue', 'indigo', 'deep-purple', 'purple', 'pink', 'red',
        'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber',
        'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'];

    constructor() {
        this.colorClass = this.colorClasses[0];
    }

    nextColor() {
        let index = this.colorClasses.indexOf(this.colorClass) + 1;
        this.colorClass = this.colorClasses[index >= this.colorClasses.length ? 0 : index];

        this.update.emit({colorClass: this.colorClass});
    }
}
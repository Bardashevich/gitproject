import {Component, animate, style, state, trigger, transition, ViewChild, ElementRef, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'search-input',
    animations: [
        trigger('state', [
            state('void', style({
                'width': '0',
                'border-bottom': '1px solid transparent'
            })),
            state('hide', style({
                'width': '0',
                'border-bottom': '1px solid transparent'
            })),
            state('search', style({
                'width': '170px'
            })),
            transition('* <=> *', animate('.3s 0 ease-in-out'))
        ])
    ],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    @Output() searchUpdated = new EventEmitter();
    @ViewChild('input') inputElement: ElementRef;

    state: 'hide' | 'search';

    constructor() {
        this.state = 'hide';
    }

    search(text) {
        this.searchUpdated.emit(text);
    }

    toggleInput() {
        this.state = this.state == 'search' ? 'hide' : 'search';

        if (this.state == 'search') {
            this.inputElement.nativeElement.focus();
        }
    }
}
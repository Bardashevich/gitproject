import {Component, trigger, style, transition, animate, Input} from "@angular/core";

@Component({
    selector: 'card',
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
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent {
    @Input('show') showCard: boolean = true;

    @Input('shadow')
    set shadow(shadowLevel: number) {
        this.shadowLevel = !shadowLevel || shadowLevel < 0 || shadowLevel > 5
            ? 1 : shadowLevel;
    }

    shadowLevel: number;

    constructor() {
    }
}

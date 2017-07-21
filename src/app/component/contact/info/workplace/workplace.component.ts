import {
    Component, trigger, style, transition, animate, Input, state, Output, EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {ContactDeleteEntity, ContactsService} from "../../../../shared/services/contacts.service";
import {WorkplaceDto} from "../../../../shared/models/contacts/WorkplaceDto";


@Component({
    selector: 'workplace',
    animations: [
        trigger('toggle', [
            state('void', style({
                'opacity': '0',
                'padding': '0 0 0 20px',
                'height': '0px'
            })),
            transition('* <=> *', animate('.3s 0 ease-in-out'))
        ]),
    ],
    templateUrl: './workplace.component.html',
    styleUrls: ['./workplace.component.scss']
})
export class WorkplaceComponent {
    @Input('contact') contact;
    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    editMode: boolean = false;
    removed: Array<WorkplaceDto> = [];

    constructor(private contactsService: ContactsService) {
    }

    save() {
        if (!this.contact.id) {
            return;
        }

        this.removed.forEach(r => {
            this.contactsService.deleteContactEntity(this.contact.id, r.id, ContactDeleteEntity.Workplace)
                .subscribe(response => {
                });
        });
        this.removed = [];

        if (this.contact.photoUrl) {
            this.contact.photoUrl = this.contact.photoUrl.replace(/file:/, "");
        }

        this.contactsService.update(this.contact).subscribe(() => {
            this.contactsService.get(this.contact.id).subscribe((response) => {
                this.contact = response;
            });
        });
    }

    add() {
        this.contact.workplaces.push(new WorkplaceDto());
    }

    remove() {
        _.remove(this.contact.workplaces, {selected: true})
            .filter((removed: WorkplaceDto) => removed.id)
            .forEach((removedWithId: WorkplaceDto) => this.removed.push(removedWithId));
    }

    changeStartDate(workplace, date) {
        if (date) {
            workplace.startDate = new Date(date);
        }
    }

    changeEndDate(workplace, date) {
        if (date) {
            workplace.endDate = new Date(date);
        }
    }

    isData() {
        return this.contact.workplaces && this.contact.workplaces.length;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    isAnyChecked() {
        return this.contact.workplaces.some(_ => _.selected);
    }

    get countSelectedItems() {
        return this.contact.workplaces.filter(_ => _.selected).length;
    }

    isAnyDirty(form) {
        for (let controlName in  form.controls) {
            if (!controlName.includes("contactWorkplaceSelect") && form.controls[controlName].dirty) {
                return true;
            }
        }
        return false;
    }
}

import {
    Component, trigger, style, transition, animate, Input, state, Output, EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {ContactDeleteEntity, ContactsService} from "../../../../shared/services/contacts.service";
import {EmailDto} from "../../../../shared/models/contacts/EmailDto";

@Component({
    selector: 'email',
    animations: [
        trigger('toggle', [
            state('void', style({
                'opacity': '0',
                'padding': '0 0 0 20px',
                'height': '0px'
            })),
            transition('* <=> *', animate('.3s 0 ease-in-out'))
        ])
    ],
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss']
})
export class EmailComponent {
    @Input('contact') contact;
    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    editMode: boolean = false;
    removed: Array<EmailDto> = [];
    emailTypes: Array<any> = [];

    constructor(private contactsService: ContactsService) {
        this.contactsService.getDictionary().subscribe((response) => {
                if (response) {
                    this.emailTypes = response.emailTypes;
                }
            },
            error => {
            });
    }

    save() {
        if (!this.contact.id) {
            return;
        }

        this.removed.forEach(r => {
            this.contactsService.deleteContactEntity(this.contact.id, r.id, ContactDeleteEntity.Email)
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
        this.contact.emails.push(new EmailDto());
    }

    remove() {
        _.remove(this.contact.emails, {selected: true})
            .filter((removed: EmailDto) => removed.id)
            .forEach((removedWithId: EmailDto) => this.removed.push(removedWithId));
    }

    isData() {
        return this.contact.emails && this.contact.emails.length;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    isAnyChecked() {
        return this.contact.emails.some(_ => _.selected);
    }

    get countSelectedItems() {
        return this.contact.emails.filter(_ => _.selected).length;
    }

    isAnyDirty(form) {
        for (let controlName in  form.controls) {
            if (!controlName.includes("contactEmailSelect") && form.controls[controlName].dirty) {
                return true;
            }
        }
        return false;
    }
}

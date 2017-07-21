import {
    Component, trigger, style, transition, animate, Input, state, Output, EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {ContactDeleteEntity, ContactsService} from "../../../../shared/services/contacts.service";
import {MessengerAccountDto} from "../../../../shared/models/contacts/MessengerAccountDto";

@Component({
    selector: 'messenger',
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
    templateUrl: './messenger.component.html',
    styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent {
    @Input('contact') contact;
    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    editMode: boolean = false;
    removed: Array<MessengerAccountDto> = [];
    messengerTypes: Array<any> = [];

    constructor(private contactsService: ContactsService) {
        this.contactsService.getDictionary().subscribe((response) => {
                if (response) {
                    this.messengerTypes = response.messengers;
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
            this.contactsService.deleteContactEntity(this.contact.id, r.id, ContactDeleteEntity.MessengerAccount)
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
        this.contact.messengers.push(new MessengerAccountDto());
    }

    remove() {
        _.remove(this.contact.messengers, {selected: true})
            .filter((removed: MessengerAccountDto) => removed.id)
            .forEach((removedWithId: MessengerAccountDto) => this.removed.push(removedWithId));
    }

    isData() {
        return this.contact.messengers && this.contact.messengers.length;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    isAnyChecked() {
        return this.contact.messengers && this.contact.messengers.some(_ => _.selected);
    }

    get countSelectedItems() {
        return this.contact.messengers.filter(_ => _.selected).length;
    }

    isAnyDirty(form) {
        for (let controlName in  form.controls) {
            if (!controlName.includes("contactMessengerSelect") && form.controls[controlName].dirty) {
                return true;
            }
        }
        return false;
    }
}

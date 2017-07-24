import {
    Component, trigger, style, transition, animate, Input, state, Output, EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {ContactDeleteEntity, ContactsService} from "../../../../shared/services/contacts.service";
import {AttachmentDto} from "../../../../shared/models/contacts/AttachmentDto";

@Component({
    selector: 'attachment',
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
    templateUrl: './attachment.component.html',
    styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent {
    @Input('contact') contact;
    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    editMode: boolean = false;
    removed: Array<AttachmentDto> = [];

    constructor(private contactsService: ContactsService) {
    }

    save() {
        if (!this.contact.id) {
            return;
        }

        this.removed.forEach(r => {
            this.contactsService.deleteContactEntity(this.contact.id, r.id, ContactDeleteEntity.Attachment)
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
        this.contact.attachments.push(new AttachmentDto());
    }

    remove() {
        _.remove(this.contact.attachments, {selected: true})
            .filter(removed => (<AttachmentDto>removed).id)
            .forEach(removedWithId => this.removed.push(<AttachmentDto>removedWithId));
    }

    isData() {
        return this.contact.attachments && this.contact.attachments.length;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    isAnyChecked() {
        return this.contact.attachments.some(_ => _.selected);
    }

    get countSelectedItems() {
        return this.contact.attachments.filter(_ => _.selected).length;
    }

    isAnyDirty(form) {
        for (let controlName in  form.controls) {
            if (!controlName.includes("contactAttachmentSelect") && form.controls[controlName].dirty) {
                return true;
            }
        }
        return false;
    }
}

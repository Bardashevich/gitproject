import {
    Component, trigger, style, transition, animate, Input, state, Output, EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {ContactDeleteEntity, ContactsService} from "../../../../shared/services/contacts.service";
import {TelephoneDto} from "../../../../shared/models/contacts/TelephoneDto";

@Component({
    selector: 'telephone',
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
    templateUrl: './telephone.component.html',
    styleUrls: ['./telephone.component.scss']
})
export class TelephoneComponent {
    @Input('contact') contact;
    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    editMode: boolean = false;
    removed: Array<TelephoneDto> = [];
    telephoneTypes: Array<any> = [];

    constructor(private contactsService: ContactsService) {
        this.contactsService.getDictionary().subscribe((response) => {
                if (response) {
                    this.telephoneTypes = response.telephoneTypes;
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
            this.contactsService.deleteContactEntity(this.contact.id, r.id, ContactDeleteEntity.Telephone)
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
        this.contact.telephones.push(new TelephoneDto());
    }

    remove() {
        _.remove(this.contact.telephones, {selected: true})
            .filter((removed: TelephoneDto) => removed.id)
            .forEach((removedWithId: TelephoneDto) => this.removed.push(removedWithId));
    }

    isData() {
        return this.contact.telephones && this.contact.telephones.length;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    isAnyChecked() {
        return this.contact.telephones.some(_ => _.selected);
    }

    get countSelectedItems() {
        return this.contact.telephones.filter(_ => _.selected).length;
    }

    isAnyDirty(form) {
        for (let controlName in  form.controls) {
            if (!controlName.includes("contactTelephoneSelect") && form.controls[controlName].dirty) {
                return true;
            }
        }
        return false;
    }
}

import {
    Component, trigger, style, transition, animate, Input, state, Output, EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {ContactDeleteEntity, ContactsService} from "../../../../shared/services/contacts.service";
import {AddressDto} from "../../../../shared/models/contacts/AddressDto";


@Component({
    selector: 'address',
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
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})
export class AddressComponent {
    @Input('contact') contact;
    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    editMode: boolean = false;
    removed: Array<AddressDto> = [];
    countries: Array<any> = [];

    constructor(private contactsService: ContactsService) {
        this.contactsService.getDictionary().subscribe((response) => {
                if (response) {
                    this.countries = response.countries;
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
            this.contactsService.deleteContactEntity(this.contact.id, r.id, ContactDeleteEntity.Address)
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
        this.contact.addresses.push(new AddressDto());
    }

    remove() {
        _.remove(this.contact.addresses, {selected: true})
            .filter((removed: AddressDto) => removed.id)
            .forEach((removedWithId: AddressDto) => this.removed.push(removedWithId));
    }

    isData() {
        return this.contact.addresses && this.contact.addresses.length;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    isAnyChecked() {
        return this.contact.addresses.some(_ => _.selected);
    }

    get countSelectedItems() {
        return this.contact.addresses.filter(_ => _.selected).length;
    }

    isAnyDirty(form) {
        for (let controlName in  form.controls) {
            if (!controlName.includes("contactAddressSelect") && form.controls[controlName].dirty) {
                return true;
            }
        }
        return false;
    }
}

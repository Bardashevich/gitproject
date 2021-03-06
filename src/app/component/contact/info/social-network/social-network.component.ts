import {
    Component, trigger, style, transition, animate, Input, state, Output, EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {ContactDeleteEntity, ContactsService} from "../../../../shared/services/contacts.service";
import {SocialNetworkAccountDto} from "../../../../shared/models/contacts/SocialNetworkAccountDto";

@Component({
    selector: 'social-network',
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
    templateUrl: './social-network.component.html',
    styleUrls: ['./social-network.component.scss']
})
export class SocialNetworkComponent {
    @Input('contact') contact;
    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    editMode: boolean = false;
    removed: Array<SocialNetworkAccountDto> = [];
    socialNetworks: Array<any> = [];

    constructor(private contactsService: ContactsService) {
        this.contactsService.getDictionary().subscribe((response) => {
                if (response) {
                    this.socialNetworks = response.socialNetworks;
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
            this.contactsService.deleteContactEntity(this.contact.id, r.id, ContactDeleteEntity.SocialNetwork)
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
        this.contact.socialNetworks.push(new SocialNetworkAccountDto());
    }

    remove() {
        _.remove(this.contact.socialNetworks, {selected: true})
            .filter(removed => (<SocialNetworkAccountDto>removed).id)
            .forEach(removedWithId => this.removed.push(<SocialNetworkAccountDto>removedWithId));
    }

    isData() {
        return this.contact.socialNetworks && this.contact.socialNetworks.length;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    isAnyChecked() {
        return this.contact.socialNetworks.some(_ => _.selected);
    }

    get countSelectedItems() {
        return this.contact.socialNetworks.filter(_ => _.selected).length;
    }

    isAnyDirty(form) {
        for (let controlName in  form.controls) {
            if (!controlName.includes("contactSocialNetworkSelect") && form.controls[controlName].dirty) {
                return true;
            }
        }
        return false;
    }
}

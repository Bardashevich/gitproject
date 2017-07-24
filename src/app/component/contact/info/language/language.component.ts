import {
    Component, trigger, style, transition, animate, Input, state, Output, EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {ContactDeleteEntity, ContactsService} from "../../../../shared/services/contacts.service";
import {LanguageDto} from "../../../../shared/models/contacts/LanguageDto";

@Component({
    selector: 'language',
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
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.scss']
})
export class LanguageComponent {
    @Input('contact') contact;
    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    editMode: boolean = false;
    removed: Array<LanguageDto> = [];
    languages: Array<any> = [
        {
            name: 'ENGLISH',
            value: 'English'
        },
        {
            name: 'RUSSIAN',
            value: 'Russian'
        },
        {
            name: 'DEUTSCH',
            value: 'Deutsch'
        },
        {
            name: 'FRENCH',
            value: 'French'
        },
        {
            name: 'SPANISH',
            value: 'Spanish'
        }
    ];
    levels: Array<any> = [
        {
            name: 'BEGINNER',
            value: 'Beginner'
        },
        {
            name: 'ELEMENTARY',
            value: 'Elementary'
        },
        {
            name: 'PRE_INTERMEDIATE',
            value: 'Pre intermediate'
        },
        {
            name: 'INTERMEDIATE',
            value: 'Intermediate'
        },
        {
            name: 'UPPER_INTERMEDIATE',
            value: 'Upper intermediate'
        },
        {
            name: 'ADVANCED',
            value: 'Advanced'
        },
        {
            name: 'PROFICIENCY',
            value: 'Proficiency'
        }
    ];

    constructor(private contactsService: ContactsService) {
    }

    save() {
        if (!this.contact.id) {
            return;
        }

        this.removed.forEach(r => {
            this.contactsService.deleteContactEntity(this.contact.id, r.id, ContactDeleteEntity.Language)
                .subscribe(response => {
                });
        });
        this.removed = [];

        if (this.contact.photoUrl) {
            this.contact.photoUrl = this.contact.photoUrl.replace(/file:/, "");
        }

        this.contactsService.update(this.contact).subscribe(response => {
            this.contactsService.get(this.contact.id).subscribe((data) => {
                this.contact = data;
            });
        });
    }

    add() {
        this.contact.languages.push(new LanguageDto());
    }

    remove() {
        _.remove(this.contact.languages, {selected: true})
            .filter(removed => (<LanguageDto>removed).id)
            .forEach(removedWithId => this.removed.push(<LanguageDto>removedWithId));
    }

    isData() {
        return this.contact.languages && this.contact.languages.length;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    isAnyChecked() {
        return this.contact.languages.some(_ => _.selected);
    }

    get countSelectedItems() {
        return this.contact.languages.filter(_ => _.selected).length;
    }

    isAnyDirty(form) {
        for (let controlName in  form.controls) {
            if (!controlName.includes("contactLanguageSelect") && form.controls[controlName].dirty) {
                return true;
            }
        }
        return false;
    }
}

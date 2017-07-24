import {
    Component, trigger, style, transition, animate, Input, state, Output, EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {ContactDeleteEntity, ContactsService} from "../../../../shared/services/contacts.service";
import {UniversityEducationDto} from "../../../../shared/models/contacts/UniversityEducationDto";

@Component({
    selector: 'education',
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
    templateUrl: './education.component.html',
    styleUrls: ['./education.component.scss']
})
export class EducationComponent {
    @Input('contact') contact;
    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    editMode: boolean = false;
    removed: Array<UniversityEducationDto> = [];
    certificateTypes: Array<any> = [];

    constructor(private contactsService: ContactsService) {
        this.contactsService.getDictionary().subscribe((response) => {
                if (response) {
                    this.certificateTypes = response.certificateTypes;
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
            this.contactsService.deleteContactEntity(this.contact.id, r.id, ContactDeleteEntity.EducationInfo)
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
        this.contact.educations.push(new UniversityEducationDto());
    }

    remove() {
        _.remove(this.contact.educations, {selected: true})
            .filter((removed: UniversityEducationDto) => removed.id)
            .forEach((removedWithId: UniversityEducationDto) => this.removed.push(removedWithId));
    }

    changeStartDate(education, date) {
        if (date) {
            education.startDate = new Date(date);
        }
    }

    isData() {
        return this.contact.educations && this.contact.educations.length;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    isAnyChecked() {
        return this.contact.educations.some(_ => _.selected);
    }

    get countSelectedItems() {
        return this.contact.educations.filter(_ => _.selected).length;
    }

    isAnyDirty(form) {
        for (let controlName in  form.controls) {
            if (!controlName.includes("contactEducationSelect") && form.controls[controlName].dirty) {
                return true;
            }
        }
        return false;
    }
}

import {
    Component, trigger, state, style, transition, animate, Input, Output, EventEmitter
} from '@angular/core';
import * as _ from "lodash";
import {ContactDeleteEntity, ContactsService} from "../../../../shared/services/contacts.service";
import {SkillDto} from "../../../../shared/models/contacts/SkillDto";

@Component({
    selector: 'skill',
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
    templateUrl: './skill.component.html',
    styleUrls: ['./skill.component.scss']
})
export class SkillComponent {
    @Input('contact')
    set contactAndSkillChips(contact) {
        this.contact = contact;
        this.skills = {
            data: contact ? contact.skills.map(skill => ({tag: skill.name})) : [],
            secondaryPlaceholder: "Enter Skill"
        };
    }

    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    contact;
    skills: { data: Array<{ tag: any }>; placeholder?; secondaryPlaceholder?; } = {
        data: [],
        secondaryPlaceholder: "Enter Skill"
    };
    removed: Array<any> = [];

    constructor(private contactsService: ContactsService) {
    }

    save() {
        if (!this.contact.id) {
            return;
        }

        this.removed.forEach(r => {
            this.contactsService.deleteContactEntity(this.contact.id, r.id, ContactDeleteEntity.Skill)
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
                        this.skills = {
                            data: response ? response.skills.map(skill => ({tag: skill.name})) : [],
                            secondaryPlaceholder: "Enter Skill"
                        };
                    },
                    error => {
                    });
            },
            error => {
            });
    }

    addSkill(chip) {
        if (!_.find(this.contact.skills, {name: chip.tag})) {
            let skill = new SkillDto();
            skill.name = chip.tag;
            this.contact.skills.push(skill);
        }
    }

    deleteSkill(chip) {
        _.remove(this.contact.skills, {name: chip.tag})
            .filter(removed => (<SkillDto>removed).id)
            .forEach(removedWithId => this.removed.push(<SkillDto>removedWithId));
    }

    isData() {
        return this.contact.skills.length;
    }

    isAnyNew() {
        return this.contact.skills.some(s => !s.id);
    }
}

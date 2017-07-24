import {Component, OnInit, style, trigger, transition, animate, Input} from '@angular/core';
import * as _ from "lodash";

@Component({
    selector: 'vacancy-skill',
    animations: [
        trigger('enterAnimation', [
            transition(':enter', [
                style({transform: 'translateY(5%)', opacity: 0}),
                animate('.2s', style({transform: 'translateY(0)', opacity: 1}))
            ]),
            transition(':leave', [
                style({transform: 'translateY(0)', opacity: 1}),
                animate('.2s', style({transform: 'translateY(5%)', opacity: 0}))
            ])
        ])
    ],
    templateUrl: './vacancy-skill.component.html',
    styleUrls:['vacancy-skill.component.scss']
})
export class VacancySkillComponent implements OnInit{
    @Input() vacancy;
    @Input() skills:{data:Array<{tag:any}>; placeholder?; secondaryPlaceholder?;};
    @Input() isRequired;
    @Input() title;

    ngOnInit() {
        var skills = _.filter(this.vacancy.vacancySkills, ['required', this.isRequired])
            .map(this.vacancySkillToChip);
        this.skills = {'data': skills};
    }

    private vacancySkillToChip(skill) {
        return {'tag': skill.name};
    }

    addSkill(chip) {
        this.vacancy.vacancySkills.push({id: null, name: chip.tag, "dateDeleted": null, required: this.isRequired});
        this.skills.data.push({tag: chip.tag});
    }

    deleteSkill(chip) {
        this.vacancy.vacancySkills.forEach(s => {
            if (s.name == chip.tag && s.id) {
                s.dateDeleted = new Date();
            } else if (s.name == chip.tag) {
                _.remove(this.vacancy.vacancySkills, {'name': s.name});
            }
        });
    }
    
    hasSkills(){
        return !_.isEmpty(this.vacancy.vacancySkills);
    }
}

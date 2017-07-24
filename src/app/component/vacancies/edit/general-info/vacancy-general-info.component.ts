import {Component, Input, OnInit, ViewChild, ElementRef} from "@angular/core";
import {VacanciesService} from "../../../../shared/services/vacancies.service";

import {ContactsService} from "../../../../shared/services/contacts.service";
import {FormGroup} from "@angular/forms";
import * as _ from "lodash";

@Component({
    selector: 'vacancy-general-info',
    templateUrl: 'vacancy-general-info.component.html',
    styleUrls: ['vacancy-general-info.component.scss']
})
export class VacancyGeneralInfoComponent implements OnInit{
    
    @Input() vacancy;
    @ViewChild('vacancyForm') vacancyForm: FormGroup;

    private hrGroup: Object;
    private hrs: Object = {};
    private dmGroup: Object;
    private dms: Object = {};
    private today = new Date();
    private educationTypes: Array<string>;
    private priorities: Array<any>;
    private languageLevels: Array<string> = [
        'Beginner',
        'Elementary',
        'Pre intermediate',
        'Intermediate',
        'Upper intermediate',
        'Advanced',
        'Proficiency'];

    constructor(private vacancyService:VacanciesService, private contactService:ContactsService) {
    }

    ngOnInit() {
        this.contactService.getContactsByGroupName('HRs').subscribe(response => {
            let autoCompleteObject = {};
            for (let item of response) {
                let fullName = item.firstName + ' ' + item.lastName;
                autoCompleteObject[fullName] = null;
                this.hrs[fullName] = item;
            }
            this.hrGroup = autoCompleteObject;
        });
        this.contactService.getContactsByGroupName('DEPARTMENT_MANAGERs').subscribe(response => {
            let autoCompleteObject = {};
            for (let item of response) {
                let fullName = item.firstName + ' ' + item.lastName;
                autoCompleteObject[fullName] = null;
                this.dms[fullName] = item;
            }
            this.dmGroup = autoCompleteObject;
        });
        this.vacancyService.getEducationTypes().subscribe(response => this.educationTypes = response);
        this.vacancyService.getPiorities().subscribe(response => this.priorities = response);
    }

    changeHr(value) {
        this.vacancy.hr = this.hrs[value];
    }

    changeCreator(value) {
        this.vacancy.creator = this.dms[value];
    }

    changeOpenDate(value) {
        this.vacancy.openDate = new Date(Date.parse(value));
    }

    changeCloseDate(value) {
        this.vacancy.closeDate = new Date(Date.parse(value));
    }
}

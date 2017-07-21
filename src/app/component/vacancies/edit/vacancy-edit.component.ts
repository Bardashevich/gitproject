import {Component, OnInit, ViewChild, trigger, style, transition, animate} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {VacanciesService} from "../../../shared/services/vacancies.service";
import {Vacancy} from "../../../shared/models/vacancies/vacancy";
import {VacancyGeneralInfoComponent} from "./general-info/vacancy-general-info.component";
import * as _ from "lodash";

@Component({
  selector: 'task-edit',
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
  templateUrl: 'vacancy-edit.html',
  styleUrls: ['vacancy-edit.scss']
})
export class VacancyEditComponent implements OnInit {

    @ViewChild(VacancyGeneralInfoComponent)
    private vacancyGeneralInfoComponent:VacancyGeneralInfoComponent;

    private vacancy:Vacancy;

    constructor(private route:ActivatedRoute, private vacancyService:VacanciesService, private router:Router) {
    }

    ngOnInit() {
        let vacancyId = this.route.snapshot.params['id'];
        if (vacancyId != 0) {
            this.vacancyService.get(vacancyId).subscribe(response => {
                this.vacancy = response ? response : new Vacancy;
            })
        } else {
            this.vacancy = new Vacancy;
        }
    }

    cancel() {
        this.router.navigate(['/vacancies.list']);
    }

    save() {
        if (!this.isFormValid()) {
            return;
        }
        if (this.vacancy.id) {
            this.vacancyService.update(this.vacancy).subscribe(response => {
                this.router.navigate(['/vacancies.list']);
            });
        } else {
            this.vacancyService.create(this.vacancy).subscribe(response => {
                this.router.navigate(['/vacancies.list']);
            });
        }
    }

    isFormValid() {
        if (this.vacancyGeneralInfoComponent.vacancyForm.valid
            && !_.isEmpty(this.vacancy.vacancySkills)) {
            return true;
        }

        let controls = this.vacancyGeneralInfoComponent.vacancyForm.controls;

        for (let control in controls) {
            controls[control].markAsDirty();
            controls[control].markAsTouched();
        }
        return false;
    }
}

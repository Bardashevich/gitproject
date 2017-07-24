import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {VacancyEditComponent} from "./edit/vacancy-edit.component";
import {VacancyGeneralInfoComponent} from "./edit/general-info/vacancy-general-info.component";
import {VacancySkillComponent} from "./edit/general-info/skill/vacancy-skill.component";
import {FullNamePipe} from "./edit/general-info/pipe/full-name.pipe";
import {FormsModule} from "@angular/forms";
import {MaterializeModule} from "angular2-materialize";
@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MaterializeModule
    ],
    declarations:[
        VacancyEditComponent,
        VacancyGeneralInfoComponent,
        VacancySkillComponent,
        FullNamePipe
    ],
    exports:[
        VacancyEditComponent,
        VacancyGeneralInfoComponent,
        VacancySkillComponent,
        FullNamePipe
    ]
})
export class VacanciesModule{}
import {CommonModule, DatePipe} from "@angular/common";
import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {Routes, RouterModule} from '@angular/router';
import {Ng2BootstrapModule} from "ng2-bootstrap";

import {RootComponent} from "./root.component";
import {NotFoundComponent} from "../not-found/not-found.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "../login/login.component";
import {CustomAlertComponent} from "../directives/alert.component";
import {HttpModule} from "@angular/http";
import {AlertModule} from 'ng2-bootstrap';
import {BsDropdownModule} from 'ng2-bootstrap';
import {DashboardComponent} from "../dashboard/dashboard.component";
import {GridsterModule} from "../../lib/gridster/gridster.module";
import {DropdownSettingsComponent} from "../dashboard/dropdown-settings/dropdownSettings.component";
import {Ng2Webstorage} from "ng2-webstorage";
import {NguiDatetimePickerModule, NguiDatetime} from '@ngui/datetime-picker';

import {ContactsComponent} from "../contact/list/contacts.component";
import {MaterializeModule} from "angular2-materialize";
import {ScrollSpyModule} from "ng2-scrollspy";
import {Autosize} from "angular2-autosize/angular2-autosize";
import {SettingsWallComponent} from "../contact/settings-wall/settings-wall.component";
import {NavComponent} from "../navigation/nav.component";
import {LogoComponent} from "../navigation/logo/logo.component";
import {DropdownProfileComponent} from "../navigation/dropdown-profile/dropdown-profile.component";
import {ComponentsModule} from "../../shared/components.module";
import {AuthGuard} from "../../shared/handlers/AuthGuard";
import {UsersComponent} from "../user/list/users.component";
import {VacanciesComponent} from "../vacancies/list/vacancies.component";
import {SearchComponent} from "../contact/search/search.component";
import {FooterComponent} from "../navigation/footer/footer.component";
import {UserPersonalInfoComponent} from "../user/personal-information/personal-info.component";
import {InfoComponent} from "../contact/info/info.component";
import 'materialize-css';
import {TasksComponent} from "../task/list/tasks.component";
import {GeneralInfoComponent} from "../contact/info/general-info/general-info.component";
import {FileUploadModule} from 'ng2-file-upload';
import {AccessComponent} from '../contact/info/access/access.component';
import {SelectPipe} from '../../shared/pipes/select.pipe';
import {SkillComponent} from '../contact/info/skill/skill.component';
import {OptionPipe} from "../../shared/pipes/option.pipe";
import {VacancyEditComponent} from "../vacancies/edit/vacancy-edit.component";
import {VacanciesModule} from "../vacancies/vacancies.module";
import {TaskEditComponent} from "../task/edit/task-edit.component";
import {ContactsModalComponent} from "../modal/contacts/contacts-modal.component";
import {CompaniesComponent} from "../companies/list/companies.component";
import {LanguageComponent} from "../contact/info/language/language.component";
import {SocialNetworkComponent} from "../contact/info/social-network/social-network.component";
import {CardComponent} from "../common/card/card.component";
import {DefaultGridComponent} from "../common/def-grid/def-grid.component";
import {DefaultGridHeaderComponent} from "../common/def-grid-header/def-grid-header.component";
import {EmailComponent} from "../contact/info/email/email.component";
import {TelephoneComponent} from "../contact/info/telephone/telephone.component";
import {MessengerComponent} from "../contact/info/messenger/messenger.component";
import {AddressComponent} from "../contact/info/address/address.component";
import {WorkplaceComponent} from "../contact/info/workplace/workplace.component";
import {EducationComponent} from "../contact/info/education/education.component";
import {AttachmentComponent} from "../contact/info/attachment/attachment.component";
import {CommentComponent} from "../contact/info/comment/comment.component";
import {CompaniesModalComponent} from "../modal/companies/companies-modal.component";
import {LoginData} from "../../shared/models/login/login-data";

const routes: Routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
            {path: 'dashboard', component: DashboardComponent},
            {path: 'contacts.list', component: ContactsComponent},
            {path: 'users.list', component: UsersComponent},
            {path: 'tasks.list', component: TasksComponent},
            {path: 'contacts.list/edit/:id', component: SettingsWallComponent},
            {path: 'users/:userId', component: UserPersonalInfoComponent},
            {path: 'tasks/:taskId', component: TaskEditComponent},
            {path: 'vacancies.list', component: VacanciesComponent},
            {path: 'companies.list', component: CompaniesComponent},
            {path: 'vacancies.list/edit/:id', component: VacancyEditComponent},
            {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
        ]
    },
    {path: 'login', component: LoginComponent},
    {path: '**', component: NotFoundComponent}
];

// Override Date object formatter
let datePipe: DatePipe = new DatePipe('en-US');
NguiDatetime.formatDate = (date: Date) : string => {
    return datePipe.transform(date, 'dd MMMM, yyyy  HH:mm');
};

// Override Date object parser
NguiDatetime.parseDate = (str: any): Date => {
    return new Date(str);
} ;

@NgModule({
    imports: [
        CommonModule,
        Ng2BootstrapModule,
        AlertModule.forRoot(),
        BsDropdownModule.forRoot(),
        ComponentsModule.forRoot(),
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        GridsterModule,
        RouterModule.forRoot(routes, {useHash: true}),
        MaterializeModule,
        ScrollSpyModule.forRoot(),
        Ng2Webstorage,
        FileUploadModule,
        NguiDatetimePickerModule,
        VacanciesModule
    ],
    declarations: [
        RootComponent,
        CardComponent,
        DefaultGridComponent,
        DefaultGridHeaderComponent,
        LoginComponent,
        DropdownSettingsComponent,
        DashboardComponent,
        NotFoundComponent,
        CustomAlertComponent,
        ContactsComponent,
        UsersComponent,
        VacanciesComponent,
        Autosize,
        SettingsWallComponent,
        NavComponent,
        LogoComponent,
        DropdownProfileComponent,
        SearchComponent,
        FooterComponent,
        GeneralInfoComponent,
        LanguageComponent,
        SocialNetworkComponent,
        EmailComponent,
        TelephoneComponent,
        MessengerComponent,
        AddressComponent,
        WorkplaceComponent,
        SkillComponent,
        EducationComponent,
        AttachmentComponent,
        CommentComponent,
        InfoComponent,
        UserPersonalInfoComponent,
        TasksComponent,
        TaskEditComponent,
        AccessComponent,
        SelectPipe,
        OptionPipe,
        CompaniesComponent,
        ContactsModalComponent,
        CompaniesModalComponent
    ],
    bootstrap: [RootComponent]
})
export class RootModule {
}

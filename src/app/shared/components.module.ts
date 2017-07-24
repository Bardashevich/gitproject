import {NgModule, ModuleWithProviders, ErrorHandler}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {HttpClient} from "./services/http-client.service";
import {ContactsService} from "./services/contacts.service";
import {AuthService} from "./services/auth.service";
import {CustomErrorHandler} from "./handlers/CustomErrorHandler";
import {AuthGuard} from "./handlers/AuthGuard";
import {AlertService} from "./services/alert.service";
import {UserService} from "./services/users.service";
import {VacanciesService} from "./services/vacancies.service";
import {RoleService} from "./services/roles.service";
import {GroupService} from "./services/groups.service";
import {PropertiesService} from "../component/contact/info/properties/properties.service";
import {TaskService} from "./services/tasks.service";
import {ImageService} from "./services/images.service";
import {CompaniesService} from "./services/companies.service";


const PIPES = [
];

const DIRECTIVES = [
];

const SERVICES = [
  HttpClient,
  ContactsService,
  AuthService,
  AlertService,
  UserService,
  VacanciesService,
  RoleService,
  GroupService,
  PropertiesService,
  TaskService,
  ImageService,
  CompaniesService  
];

const HANDLERS = [
  AuthGuard,
  {provide: ErrorHandler, useClass: CustomErrorHandler}
];

const VALIDATORS = [

];

@NgModule({
  declarations: [
    ...DIRECTIVES,
    ...PIPES
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...DIRECTIVES,
    ...PIPES
  ]
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: ComponentsModule,
      providers: [
        ...VALIDATORS,
        ...SERVICES,
        ...HANDLERS
      ],
    };
  }
}

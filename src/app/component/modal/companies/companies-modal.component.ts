import {Component, trigger, state, style, transition, animate, Input, EventEmitter, ViewChild} from '@angular/core';
import {ContactsService} from "../../../shared/services/contacts.service";
import "materialize-css";
import {ContactModel} from "../../../shared/models/contacts/ContactDto";
import {MaterializeAction} from "angular2-materialize";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {GridColumn} from "../../../shared/models/grid/grid-column";
import {DefaultGridComponent} from "../../common/def-grid/def-grid.component";
import {GridOptions} from "../../../shared/models/grid/grid-options";
import {GridHeaderOptions} from "../../../shared/models/grid/grid-header-options";
import {Company} from "../../../shared/models/companies/company";
import {CompaniesService} from "../../../shared/services/companies.service";

@Component({
  selector: 'companies-modal',
  templateUrl: 'companies-modal.compoent.html',
  styleUrls: ['companies-modal.component.scss']
})
export class CompaniesModalComponent {
  @Input() companiesInput: Array<Company> = [];
  @Input() modalActions: EventEmitter<string|MaterializeAction> = new EventEmitter<string|MaterializeAction>();

  @ViewChild(DefaultGridComponent) private defGridComponent: DefaultGridComponent<Company>;
  private gridOptions: GridOptions = new GridOptions;
  private gridHeaderOptions: GridHeaderOptions = new GridHeaderOptions;
  private datePipe: DatePipe;

  constructor(private companiesService: CompaniesService) {
    this.datePipe = new DatePipe('en-US');
    this.initializeGrid();
  }

  initializeGrid() {
    this.gridHeaderOptions.title = 'Companies';

    this.gridOptions.afterProcessing = this.afterProcessing.bind(this);
    this.gridOptions.findFunction = this.companiesService.find.bind(this.companiesService);
    this.gridOptions.defaultSortProperty = 'name';
    this.gridOptions.columns.push(
      new GridColumn('Name', 'name', '51%', true, 'name'),
      new GridColumn('Number of Employees', 'employeeNumber', '43%', true, 'employeeNumberCategory.id')
    )
  }

  isAnyChecked() {
    this.defGridComponent.isAnyChecked();
  }

  afterProcessing(companies: Array<Company>) {
    companies.forEach(company => {
      company.employeeNumber = company.employeeNumberCategory && company.employeeNumberCategory.name;
    });
    return companies;
  }

  close() {
    this.defGridComponent.entities.forEach(value => value.selected = false);
    this.modalActions.emit({action:'modal', params:['close']})
  }

  add() {
    this.companiesInput.push(...this.defGridComponent.entities
      .filter(value => value.selected)
      .map(value => {
        value.selected = false;
        return value;
      })
      .filter(value => !this.companiesInput.some(inputValue => inputValue.id === value.id))
      .map(value => {
        return Object.assign({}, value)
      }));
    this.modalActions.emit({action:'modal', params:['close']});
  }
}

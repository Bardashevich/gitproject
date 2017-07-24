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

@Component({
  selector: 'contacts-modal',
  templateUrl: 'contacts-modal.compoent.html',
  styleUrls: ['contacts-modal.component.scss']
})
export class ContactsModalComponent {
  @Input() contactsInput: Array<ContactModel> = [];
  @Input() modalActions: EventEmitter<string|MaterializeAction> = new EventEmitter<string|MaterializeAction>();

  @ViewChild(DefaultGridComponent) private defGridComponent: DefaultGridComponent<ContactModel>;
  private gridOptions: GridOptions = new GridOptions;
  private gridHeaderOptions: GridHeaderOptions = new GridHeaderOptions;
  private datePipe: DatePipe;

  constructor(private contactsService: ContactsService) {
    this.datePipe = new DatePipe('en-US');
    this.initializeGrid();
  }

  initializeGrid() {
    this.gridHeaderOptions.title = 'Contacts';

    this.gridOptions.afterProcessing = this.afterProcessing.bind(this);
    this.gridOptions.findFunction = this.contactsService.find.bind(this.contactsService);
    this.gridOptions.defaultSortProperty = 'firstName';
    this.gridOptions.columns.push(
      new GridColumn('Full Name', 'fullName', '36%', true, 'firstName'),
      new GridColumn('Email', 'firstEmail', '29%', false, 'emails'),
      new GridColumn('Telephone', 'firstTelephone', '29%', false, 'telephones')
    )
  }

  isAnyChecked() {
    this.defGridComponent.isAnyChecked();
  }

  afterProcessing(contacts: Array<ContactModel>) {
    contacts.forEach(contact => {
      contact.fullName = `${contact.firstName} ${contact.lastName}`;
      contact.firstEmail = contact.emails && contact.emails[0] && contact.emails[0].name;
      contact.firstTelephone = contact.telephones && contact.telephones[0] && contact.telephones[0].name;
      contact.firstAddress = contact.addresses && contact.addresses[0] && contact.addresses[0].name;
    });
    return contacts;
  }

  close() {
    this.defGridComponent.entities.forEach(value => value.selected = false);
    this.modalActions.emit({action:'modal', params:['close']});
  }

  add() {
    this.contactsInput.push(...this.defGridComponent.entities
      .filter(value => value.selected)
      .map(value => {
        value.selected = false;
        return value;
      })
      .filter(value => !this.contactsInput.some(inputValue => inputValue.id === value.id))
      .map(value => {
        return Object.assign({}, value)
      }));
    this.modalActions.emit({action:'modal', params:['close']});
  }
}

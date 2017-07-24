import {Component, trigger, state, style, transition, animate} from '@angular/core';
import {ContactsService} from "../../../shared/services/contacts.service";
import "materialize-css";
import * as _ from 'lodash'
import {Router} from '@angular/router';

@Component({
    selector: 'settings',
    providers: [ContactsService],
    animations: [
        trigger('enterFilterAnimation', [
            transition(':enter', [
                style({transform: 'translateY(-5%)', opacity: 0}),
                animate('.2s', style({transform: 'translateY(0)', opacity: 1}))
            ]),
            transition(':leave', [
                style({transform: 'translateY(0)', opacity: 1}),
                animate('.2s', style({transform: 'translateY(-5%)', opacity: 0}))
            ])
        ])
    ],
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss', '../../../../public/css/color.scss']
})
export class ContactsComponent {
    state;
    states = [
        {name: 'General Info', value: 'general-info'},
        {name: 'Contact Info', value: 'contact-info', disabled: true},
        {name: 'Work Experience', value: 'work-experience'},
        {name: 'Education', value: 'education', disabled: true},
        {name: 'Attachments', value: 'attachments', disabled: true},
        {name: 'Comments', value: 'comments', disabled: true},
        {name: 'Access', value: 'access', disabled: true}
    ];
    sortOptions: { columnName: 'firstName' | 'emails' | 'telephones'; desc: boolean; };

    params = [
        {
            onOpen: (el) => {
                console.log("Collapsible open", el);
            },
            onClose: (el) => {
                console.log("Collapsible close", el);
            }
        }
    ];

    filter = {
        from: 0,
        count: 20,
        text: '',
        sortProperty: 'firstName',
        sortAsc: true
    };

    showSpinner;
    contact;
    defaultContact;
    contacts;
    private totalResults: number;
    private COUNT_CONTACT: number = 20;
    private countPage: number;
    private currentPage: number;
    private pages: Array<number> = [];

    constructor(private router: Router, private contactsService: ContactsService) {
        this.state = this.states[0];
        this.defaultContact = {id:0};
        this.sortOptions = {columnName: 'firstName', desc: false};

        this.showSpinner = true;
        this.contactsService.find(this.filter).subscribe((response) => {
            this.contacts = response.data;
            this.totalResults = response.totalCount;
            this.currentPage = 1;
            this.countPage = (this.totalResults % this.COUNT_CONTACT === 0 ? 0 : 1) + (this.totalResults / this.COUNT_CONTACT | 0 );
            this.pages = [];
            for (var _i = 1; _i < this.countPage + 1; _i++){
                this.pages.push(_i);
            }

            this.showSpinner = false;
        });
    }

    edit(contact){
        this.router.navigate(['/contacts.list/edit', contact.id]);
    }

    add(){
        this.router.navigate(['/contacts.list/edit', 0]);
    }

    searchContact(text) {
        this.filter.text = text;

        this.showSpinner = true;
        this.contactsService.find(this.filter).subscribe((response) => {
            this.contacts = response.data;
            this.totalResults = response.totalCount;
            this.currentPage = 1;
            this.countPage = (this.totalResults % this.COUNT_CONTACT === 0 ? 0 : 1) + (this.totalResults / this.COUNT_CONTACT | 0 );
            this.pages = [];
            for (var _i = 1; _i < this.countPage + 1; _i++) {
                this.pages.push(_i);
            }

            this.showSpinner = false;
        });
    }

    sortColumn(columnName) {
        if (this.sortOptions.columnName == columnName) {
            this.sortOptions.desc = !this.sortOptions.desc;
        } else {
            this.sortOptions.columnName = columnName;
            this.sortOptions.desc = false;
        }
        this.filter.sortProperty = columnName;
        this.filter.sortAsc = !this.filter.sortAsc;

        this.showSpinner = true;
        this.contactsService.find(this.filter).subscribe((response) => {
            this.contacts = response.data;
            this.totalResults = response.totalCount;
            this.currentPage = 1;
            this.countPage = (this.totalResults % this.COUNT_CONTACT === 0 ? 0 : 1) + (this.totalResults / this.COUNT_CONTACT | 0 );
            this.pages = [];
            for (var _i = 1; _i < this.countPage + 1; _i++) {
                this.pages.push(_i);
            }

            this.showSpinner = false;
        });
    }

    selectState(state) {
        this.state = state;
    }

    toggleSelection(u) {
        u.selected = !u.selected;
    }

    toggleAll(ev) {
        let selected = !this.isAllChecked();
        this.contacts.forEach(x => x.selected = selected)
    }

    isAnyChecked() {
        if (this.contacts) {
            return this.contacts.some(_ => _.selected);
        }
    }

    get countSelectedItems() {
        return this.contacts.filter(_ => _.selected).length;
    }

    isAllChecked() {
        if (this.contacts) {
            return this.contacts.every(_ => _.selected);
        }
    }

    remove(): void{
        let checkedContacts = this.contacts.filter(contact => contact.selected);
        if (checkedContacts.length > 0) {
            for (let contact of checkedContacts) {
                this.contactsService.delete(contact.id).subscribe(() => {
                    this.currentPageChanged(this.currentPage);
                });
            }
        }
    }

    loadPage(page) {
        this.showSpinner = true;

        setTimeout(() => {
            this.showSpinner = false;
            this.currentPageChanged(page);
        }, 1000);
    }

    private currentPageChanged(page){
        this.contacts = [];
        this.currentPage = page;
        this.filter.from = (page - 1) * this.COUNT_CONTACT;
        this.filter.count = this.COUNT_CONTACT;

        this.showSpinner = true;
        this.contactsService.find(this.filter).subscribe((data) => {
            this.contacts = data.data;

            this.showSpinner = false;
        });
    };
}

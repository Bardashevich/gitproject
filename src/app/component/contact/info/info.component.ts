import {Component, trigger, state, style, transition, animate, keyframes, Input, Output, EventEmitter} from "@angular/core";
import * as _ from 'lodash'
import {ContactsService} from "../../../shared/services/contacts.service";

@Component({
    selector: 'info',
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
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})
export class InfoComponent{
    @Input() state;
    @Input() indexProp;
    @Input() contact;
    @Input() properties;
    @Input() dictionary;
    @Output() toggleCard = new EventEmitter<boolean>();

    user;
    sortOptions;
    showCheckbox = false;
    initPage;
    data;
    removeData = [];

    constructor(private contactsService: ContactsService) {
        this.initPage = false;
        this.showCheckbox = false;
    }

    save(){
        if (this.properties[this.indexProp].contactDeleteEntity){
            this.removeData.forEach(p => {
                this.contactsService.deleteContactEntity(this.contact.id, p.id, this.properties[this.indexProp].contactDeleteEntity).subscribe(response => {
                });
            });
            this.removeData = [];
        }

        if (this.contact[this.properties[this.indexProp].data].length === 0 && this.removeData.length === 0) {
            this.properties[this.indexProp].showCard = false;
        }

        if(this.contact.id != 0){
            this.contact.photoUrl ? this.contact.photoUrl = this.contact.photoUrl.replace(/file:/, "") : true;
            this.contactsService.update(this.contact).subscribe(response => {
                this.contactsService.get(this.contact.id).subscribe((data) => {
                    this.contact = data;
                });
            });
            this.properties[this.indexProp].showSave = false;
        }
    }

    add(){
        if(!this.isEditData){
            let object = {};
            for (let field of this.properties[this.indexProp].fields){
                object[field.field] = '';
            }
            let newIndex = this.contact[this.properties[this.indexProp].data].length;
            if(this.contact[this.properties[this.indexProp].data]){
                this.contact[this.properties[this.indexProp].data].push(object);
            }else {
                this.contact[this.properties[this.indexProp].data] = [];
                this.contact[this.properties[this.indexProp].data].push(object);
            }
            this.isEditData = true;
            this.editContactFields = this.contact[this.properties[this.indexProp].data][newIndex];
            this.indexEditFields = newIndex;
        }
    }

    isNotEmpty(){
        return !!(this.contact[this.properties[this.indexProp].data] && this.contact[this.properties[this.indexProp].data].length > 0 && this.dictionary);
    }

    toggleSave(){
       this.contact[this.properties[this.indexProp].data][this.indexEditFields] = this.editContactFields;
       this.isEditData = false;
       this.initPage = true;
       this.properties[this.indexProp].showSave = true;
    }

    toggleCardChild(index) {
    this.toggleCard.emit(index);
    }

    mark(){
        this.showCheckbox = !this.showCheckbox;
    }

    isMark(){
        return this.showCheckbox;
    }

    isEdit(){
        return (this.properties[this.indexProp].showSave && this.initPage) ? this.properties[this.indexProp].showSave : false;
    }

    toggleAll(ev) {
        let selected = !this.isAllChecked();
        this.contact[this.properties[this.indexProp].data].filter(value => !value.dateDeleted).forEach(x => x.selected = selected)
    }

    isAllChecked() {
        if (this.contact[this.properties[this.indexProp].data]) {
            return this.contact[this.properties[this.indexProp].data].every(_ => _.selected);
        }
    }

    sortColumn(columnName) {
        if (this.sortOptions.columnName == columnName) {
            this.sortOptions.desc = !this.sortOptions.desc;
        } else {
            this.sortOptions.columnName = columnName;
            this.sortOptions.desc = false;
        }

        this.contact[this.properties[this.indexProp].data] = _.orderBy(this.contact[this.properties[this.indexProp].data], (u) => {
            let column: string = this.sortOptions.columnName;
            switch (column) {
                case this.properties[this.indexProp].fields[0].field:
                    return u[column].length ? u[column][0].name : null;
                case this.properties[this.indexProp].fields[0].field:
                    return u[column].length ? u[column][0].number : null;
                case 'firstName':
                default:
                    return u[column];
            }
        }, [this.sortOptions.desc ? 'desc' : 'asc']);
    }

    toggleSelection(u) {
        if (this.showCheckbox){
            u.selected = !u.selected;
        }
    }

    isAnyChecked() {
        if (this.contact[this.properties[this.indexProp].data]) {
            return this.contact[this.properties[this.indexProp].data].some(_ => _.selected);
        }
    }

    get countSelectedItems() {
        return this.contact[this.properties[this.indexProp].data].filter(_ => _.selected).length;
    }

    remove(){
        let checkedObjects = this.contact[this.properties[this.indexProp].data].filter(object => object.selected ? true : false);
        if (checkedObjects.length > 0) {
            for (let object of checkedObjects) {
                if(object.id && object.id != 0){
                    this.removeData.push(object);
                }
                object.dateDeleted = new Date().getTime();
                object.selected = false;
            }
            if (this.contact[this.properties[this.indexProp].data].length === 0 && this.removeData.length === 0) {
                this.properties[this.indexProp].showCard = false;
            }
            this.initPage = true;
            this.properties[this.indexProp].showSave = true;
        }
    }

    editContactFields = {};
    indexEditFields;
    isEditData = false;

    edit(index){
        this.isEditData = true;
        this.editContactFields = this.contact[this.properties[this.indexProp].data][index];
        this.indexEditFields = index;
    }

    isEditFields(){
        return this.isEditData;

    }
}
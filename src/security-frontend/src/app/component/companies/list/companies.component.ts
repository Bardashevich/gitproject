/**
 * Created by yury.sauchuk on 4/14/2017.
 */
import {Component, OnInit, trigger, state, style, transition, animate} from "@angular/core";
import {CompaniesService} from "../../../shared/services/companies.service";
import {Company} from "../../../shared/models/companies/company";
import {CompanyFilter} from "../../../shared/models/companies/company-filter";

@Component({
    selector: 'companies',
    animations: [
        trigger('mode', [
            state('void', style({
                'transform': 'translateY(10%)',
                'opacity': '0'
            })),
            transition('void => settings', animate('0s')),
            transition('void => table', animate('.3s 0s cubic-bezier(0.175, 0.885, 0.32, 1.275)'))
        ]),
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
    providers: [CompaniesService],
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit{
    
    private totalCount: number;
    private companyFilter: CompanyFilter;
    
    private companies: Array<Company> = [];
    private COUNT_COMPANIES: number = 20;
    private countPage: number;
    private currentPage: number;
    private pageIndexes: Array<number>;

    private empNumberCategoryArray = [
        {name:'Search by number of employees', value: 0},
        {name: 'Less than 50', value: 1},
        {name: '50 to 250', value: 2},
        {name: '250 to 500', value: 3},
        {name: 'More than 500', value: 4}
    ];
    
    constructor(private companiesService: CompaniesService){
    }

    ngOnInit(){
        this.companyFilter = new CompanyFilter();
        this.currentPage = 1;
        this.find();
    }

    searchCompany(text) {
        this.companyFilter.text = text;
        this.find();
    }

    applyTextFilter() {
        this.currentPage = 1;
        this.find();
    }

    isAnyChecked() {
        if (this.companies) {
            return this.companies.some(_ => _.selected);
        }
    }

    toggleAll(ev) {
        let selected = !this.isAllChecked();
        this.companies.forEach(x => x.selected = selected)
    }

    isAllChecked() {
        if (this.companies && this.companies.length > 0) {
            return this.companies.every(_ => _.selected);
        }
    }

    sortColumn(columnName) {
        if (this.companyFilter.sortProperty == columnName) {
            this.companyFilter.sortAsc = !this.companyFilter.sortAsc;
        } else {
            this.companyFilter.sortProperty = columnName;
            this.companyFilter.sortAsc = true;
        }
        this.find();
    }

    toggleSelection(vacancy) {
        vacancy.selected = !vacancy.selected;
    }

    changePage(index) {
        this.currentPage = index;
        this.companyFilter.from = (index - 1) * this.COUNT_COMPANIES;
        this.find();
    }

    changeEmployeeNumber(selected: number){
        if (selected && selected != 0) {
            this.companyFilter.employeeNumberCategoryId = selected;
        } else {
            this.companyFilter.employeeNumberCategoryId = null;
        }
        this.find();
    }

    get countSelectedItems() {
        return this.companies.filter(_ => _.selected).length;
    }

    find(){
        this.companiesService.find(this.companyFilter).subscribe((response) => {
            this.companies = response.data;
            this.totalCount = response.totalCount;
            this.countPage = (this.totalCount % this.COUNT_COMPANIES === 0 ? 0 : 1) + (this.totalCount / this.COUNT_COMPANIES | 0 );
            this.countPage = this.countPage === 0 ? 1 : this.countPage;
            this.pageIndexes = (new Array(this.countPage)).fill(0).map((x,i) => i + 1);
            if (this.countPage < this.currentPage) {
                this.currentPage = this.countPage;
            }
        });
    }

}
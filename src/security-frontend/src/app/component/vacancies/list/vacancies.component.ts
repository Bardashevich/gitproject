import {Component, OnInit, trigger, state, style, transition, animate, ViewChild, ElementRef} from '@angular/core';
import {VacanciesService} from "../../../shared/services/vacancies.service";
import {Vacancy} from "../../../shared/models/vacancies/vacancy";
import {VacancyFilter} from "../../../shared/models/vacancies/vacancy-filter";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'vacancies',
    animations: [
        trigger('mode', [
            state('void', style({
                'transform': 'translateY(10%)',
                'opacity': '0'
            })),
            transition('void => settings', animate('0s')),
            transition('void => table', animate('.3s 0s cubic-bezier(0.175, 0.885, 0.32, 1.275)'))
        ])
    ],
    templateUrl: './vacancies.html',
    styleUrls: ['./vacancies.scss']
})
export class VacanciesComponent implements OnInit {

    private totalCount:number;
    private vacancyFilter:VacancyFilter;

    private vacancies:Array<Vacancy> = [];
    private COUNT_VACANCIES:number = 20;
    private countPage:number;
    private currentPage:number;
    private pageIndexes:Array<number>;

    private periodArray = [
        {name: 'Show all vacancies', value: 0},
        {name: 'Show for current month', value: 1},
        {name: 'Show for last 2 months', value: 2},
        {name: 'Show for last 3 months', value: 3},
        {name: 'Show for last 6 months', value: 6},
        {name: 'Show for last 12 months', value: 12}];

    @ViewChild('search') inputElement:ElementRef;
    hideSearchInput:boolean = true;

    constructor(private router:Router, private vacanciesService:VacanciesService) {
    }

    ngOnInit() {
        this.vacancyFilter = new VacancyFilter();
        this.currentPage = 1;
        this.find();
    }

    searchVacancy(text) {
        this.currentPage = 1;
        this.vacancyFilter.text = text;
        this.find();
    }

    add() {
        this.router.navigate(['/vacancies.list/edit', 0]);
    }

    edit(vacancy) {
        this.router.navigate(['/vacancies.list/edit', vacancy.id]);
    }

    sortColumn(columnName) {
        if (this.vacancyFilter.sortProperty == columnName) {
            this.vacancyFilter.sortAsc = !this.vacancyFilter.sortAsc;
        } else {
            this.vacancyFilter.sortProperty = columnName;
            this.vacancyFilter.sortAsc = true;
        }
        this.find();
    }


    toggleSelection(vacancy) {
        vacancy.selected = !vacancy.selected;
    }

    toggleAll(ev) {
        let selected = !this.isAllChecked();
        this.vacancies.forEach(x => x.selected = selected)
    }

    isAnyChecked() {
        if (this.vacancies) {
            return this.vacancies.some(_ => _.selected);
        }
    }

    get countSelectedItems() {
        return this.vacancies.filter(_ => _.selected).length;
    }

    isAllChecked() {
        if (this.vacancies && this.vacancies.length > 0) {
            return this.vacancies.every(_ => _.selected);
        }
    }

    changePage(index) {
        this.currentPage = index;
        this.vacancyFilter.from = (index - 1) * this.COUNT_VACANCIES;
        this.find();
    }

    deleteVacancies() {
        let forkJoinArray: Array<Observable<any>> = this.vacancies.filter(task => task.selected).map(value => this.vacanciesService.delete(value.id));
        Observable.forkJoin(forkJoinArray).subscribe(response => this.find());
    }

    changePeriod(selected:number) {
        if (selected && selected != 0) {
            let currentDate = new Date();
            this.vacancyFilter.displayedPeriodEnd = currentDate.getTime();
            this.vacancyFilter.displayedPeriodStart = new Date().setMonth(currentDate.getMonth() - selected);
        } else {
            this.vacancyFilter.displayedPeriodEnd = null;
            this.vacancyFilter.displayedPeriodStart = null;
        }
        this.find();
    }

    find() {
        this.vacanciesService.find(this.vacancyFilter).subscribe(response => {
            this.vacancies = response.data;
            this.totalCount = response.totalCount;
            this.countPage = (this.totalCount % this.COUNT_VACANCIES === 0 ? 0 : 1) + (this.totalCount / this.COUNT_VACANCIES | 0 );
            this.countPage = this.countPage === 0 ? 1 : this.countPage;
            this.pageIndexes = (new Array(this.countPage)).fill(0).map((x, i) => i + 1);
            if (this.countPage < this.currentPage) {
                this.currentPage = this.countPage;
            }
        })
    }

}

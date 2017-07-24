import {Injectable} from "@angular/core";
import {HttpClient} from "./http-client.service";
import {Observable} from "rxjs";
import {VacancyFilter} from "../models/vacancies/vacancy-filter";
import {DataPage} from "../models/grid/data-page";
import {Vacancy} from "../models/vacancies/vacancy";
import {URLSearchParams} from "@angular/http";

@Injectable()
export class VacanciesService {

    constructor(private http: HttpClient) {
    }

    find(vacancyFilter: VacancyFilter): Observable<DataPage<Vacancy>> {
        let params: URLSearchParams = new URLSearchParams();
        Object.keys(vacancyFilter).map(key => {
            params.set(key, vacancyFilter[key]);
        });
        return this.http.get('rest/vacancies', {search: params})
            .map(response => response.json())
            .catch(this.handleError);
    }

    delete(vacancyId: number): Observable<any> {
        return this.http.delete(`rest/vacancies/${vacancyId}`)
          .catch(this.handleError);
    }

    create(vacancy: Vacancy): Observable<any> {
        return this.http.post('rest/vacancies', vacancy)
          .catch(this.handleError);
    }

    update(vacancy: Vacancy): Observable<any> {
        return this.http.put('rest/vacancies', vacancy)
          .catch(this.handleError);
    }

    get(vacancyId: number): Observable<Vacancy> {
        return this.http.get(`rest/vacancies/${vacancyId}`)
          .map(response => response.json())
          .catch(this.handleError);
    }

    getEducationTypes(): Observable<Array<string>> {
        return this.http.get('rest/dictionary/education/types')
          .map(response => response.json())
          .catch(this.handleError);
    }

    getPiorities(): Observable<Array<any>> {
        return this.http.get('rest/dictionary/priorities')
          .map(response => response.json())
          .catch(this.handleError);
    }
    
    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
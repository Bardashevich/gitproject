import {Injectable} from "@angular/core";
import {HttpClient} from "./http-client.service";
import {Observable} from "rxjs";
import {TableState} from "../models/grid/table-state";
import {Task} from "../models/task/task";
import {URLSearchParams} from "@angular/http";
import {AclEntry} from "../models/users/acl-entry";
import {NamedEntity} from "../models/named-entity";
import {DataPage} from "../models/grid/data-page";

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) {
  }

  find(taskFilter: TableState): Observable<DataPage<Task>> {
    let params: URLSearchParams = new URLSearchParams();
    Object.keys(taskFilter).map(key => {
      params.set(key, taskFilter[key]);
    });
    return this.http.get('rest/tasks/find', {search: params})
      .map(response => response.json())
      .catch(this.handleError);
  }

  get(taskId: number): Observable<Task> {
    return this.http.get(`rest/tasks/${taskId}`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  update(task: Task): Observable<any> {
    return this.http.put(`rest/tasks`, task)
      .catch(this.handleError);
  }

  save(task: Task): Observable<any> {
    return this.http.post(`rest/tasks`, task)
      .catch(this.handleError);
  }

  delete(taskId: number): Observable<any> {
    return this.http.delete(`rest/tasks/${taskId}`)
      .catch(this.handleError);
  }

  getAcls(taskId: number): Observable<Array<AclEntry>> {
    return this.http.get(`rest/tasks/${taskId}/acls`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  getStatuses(): Observable<Array<NamedEntity>> {
    return this.http.get('rest/tasks/statuses')
      .map(response => response.json())
      .catch(this.handleError);
  }

  getPriorities(): Observable<Array<NamedEntity>> {
    return this.http.get('rest/tasks/priorities')
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
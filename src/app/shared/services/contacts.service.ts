import {Injectable} from "@angular/core";
import {HttpClient} from "./http-client.service";
import {Observable} from "rxjs";
import {URLSearchParams} from "@angular/http";

export enum ContactDeleteEntity {
    Acl = <any>'acls',
    Language = <any>'languages',
    Email = <any>'emails',
    Address = <any>'addresses',
    MessengerAccount = <any>'messengers',
    SocialNetwork = <any>'social_networks',
    Telephone = <any>'telephones',
    Workplace = <any>'workplaces',
    Attachment = <any>'attachments',
    Skill = <any>'skills',
    EducationInfo = <any>'educations'
}

@Injectable()
export class ContactsService {

    constructor(private http: HttpClient) {
    }

    public isAllowed(contactId: number,  action: string): Observable<any> {
        return this.http.get(`rest/contacts/${contactId}/actions/${action}`)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public get(contactId: number): Observable<any> {
        return this.http.get(`rest/contacts/${contactId}`)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public getCurrentUserContact(): Observable<any> {
        return this.http.get('rest/contacts/current/contact')
          .map(response => response.json())
          .catch(this.handleError);
    }

    public getByUserId(userId: number): Observable<any> {
        return this.http.get(`rest/contacts/user/${userId}`)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public getNationalities(): Observable<any> {
        return this.http.get('rest/contacts/nationalities')
          .map(response => response.json())
          .catch(this.handleError);
    }

    public find(filter: Object): Observable<any> {
        return this.http.post('rest/contacts/list', filter)
            .map(response => response.json())
            .catch(this.handleError);
    }

    public getByEmail(email: String): Observable<any> {
        return this.http.get(`rest/contacts/email/${email}`)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public update(contactModel:Object): Observable<any> {
        return this.http.put('rest/contacts', contactModel)
          .map(response => {})
          .catch(this.handleError);
    }

    public findStudents(filter: Object): Observable<any> {
        return this.http.post('rest/contacts/students/list', filter)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public findComments(filter: Object): Observable<any> {
        return this.http.post('rest/contacts/comments/list', filter)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public findUnreadComments(filter: Object): Observable<any> {
        return this.http.post('rest/contacts/unread/comments/list', filter)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public setUnreadCommentsInZero(): Observable<any> {
        return this.http.put('rest/contacts/unread/comments/zero', {})
          .map(response => response.json())
          .catch(this.handleError);
    }

    public create(contactModel: Object): Observable<any> {
        return this.http.post('rest/contacts', contactModel)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public delete(contactId: number): Observable<any> {
        return this.http.delete(`rest/contacts/${contactId}`)
          .catch(this.handleError);
    }

    public addComment(contactModel: Object): Observable<any> {
        return this.http.put('rest/contacts/comment', contactModel)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public getAcls(contactId: number): Observable<any> {
        return this.http.get(`rest/contacts/${contactId}/acls`)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public createOrUpdateAcls(contactId: number, aclModels:Object[]): Observable<any> {
        return this.http.put(`rest/contacts/${contactId}/acls`, aclModels)
          .map(response => {})
          .catch(this.handleError);
    }

    public deleteContactEntity(contactId: number, entityId: number, entityType: ContactDeleteEntity): Observable<any> {
        return this.http.delete(`rest/contacts/${contactId}/${entityType}/${entityId}`)
          .map(response => {})
          .catch(this.handleError);
    }

    public getDictionary(): Observable<any> {
        return this.http.get('rest/dictionary')
          .map(response => response.json())
          .catch(this.handleError);
    }

    public getFromSocialNetworkAccount(socialNetworkAccountUrl: string): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('url', socialNetworkAccountUrl);
        return this.http.get('rest/parser/linkedIn', {search: params})
          .map(response => response.json())
          .catch(this.handleError);
    }

    public checkFile(contactId: number,  attachmentId: number): Observable<any> {
        return this.http.get(`rest/contacts/files/${contactId}/attachments/${attachmentId}/check`)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public getAllContacts(): Observable<any> {
        return this.http.get('rest/contacts/list/all')
          .map(response => response.json())
          .catch(this.handleError);
    }

    public generateReport(contactId: number,  reportType: string): Observable<any> {
        return this.http.get(`rest/contacts/${contactId}/report/${reportType}`)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public generateReports(contactReportModel: Object): Observable<any> {
        return this.http.post('rest/contacts/reports', contactReportModel)
          .map(response => response.json())
          .catch(this.handleError);
    }

    public getContactsByGroupName(userGroupName: string): Observable<any> {
        return this.http.get(`rest/contacts/group/${userGroupName}`)
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
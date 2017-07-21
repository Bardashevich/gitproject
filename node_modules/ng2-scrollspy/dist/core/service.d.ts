import { EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
export declare class ScrollSpyService {
    changes$: EventEmitter<any>;
    private observables;
    getObservable(key: string): any;
    setObservable(key: string, observable: ReplaySubject<any>): void;
    deleteObservable(key: string): void;
}

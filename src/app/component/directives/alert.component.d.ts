import { OnInit } from '@angular/core';
import { AlertService } from '../../service/index';
export declare class CustomAlertComponent implements OnInit {
    private alertService;
    alerts: Array<Object>;
    constructor(alertService: AlertService);
    closeAlert(i: number): void;
    ngOnInit(): void;
}

import { Component, OnInit } from '@angular/core';
import {isNullOrUndefined} from "util";
import {AlertService} from "../../shared/services/alert.service";

@Component({
    selector: 'custom-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.css']
})

export class CustomAlertComponent implements OnInit {
    alerts:Array<Object> = [ ];

    constructor(private alertService: AlertService) {

    }

    closeAlert(i:number) {
        this.alerts.splice(i, 1);
    }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => {
            if ( !isNullOrUndefined(message) && message != "") {
            this.alerts = [];
            this.alerts.push(message);
            }
        });
    }
}
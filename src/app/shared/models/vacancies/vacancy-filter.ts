import {TableState} from "../grid/table-state";
export class VacancyFilter extends TableState{
    showClosed : boolean;
    displayedPeriodStart : number;
    displayedPeriodEnd: number;
    
    constructor() {
        super('positionName');
        this.showClosed = false;
        this.displayedPeriodStart;
        this.displayedPeriodEnd;
    }
}
import {TableState} from "../grid/table-state";
export class CompanyFilter extends TableState {

    employeeNumberCategoryId: number;
    
    constructor(){
        super('name');
    }
}

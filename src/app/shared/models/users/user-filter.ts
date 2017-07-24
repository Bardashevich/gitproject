import {TableState} from "../grid/table-state";
export class UserFilter extends TableState{
  active: boolean;
  groupId: number;
  roleId: number;

  constructor() {
    super('userName');
    this.active = true;
  }
}
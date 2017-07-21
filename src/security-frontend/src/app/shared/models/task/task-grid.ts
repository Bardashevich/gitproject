import {GridEntity} from "../grid/grid-entity";
export class TaskGridModel extends GridEntity {
  id: number;
  name: string;
  creatorFullName: string;
  assigneeFullName: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
}
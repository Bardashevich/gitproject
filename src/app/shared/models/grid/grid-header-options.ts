import {GridHeaderAction} from "./grid-header-action";
export class GridHeaderOptions {
  title: string;
  actions: Array<GridHeaderAction> = [];
  showTextSearch: boolean = true;
}
import {GridColumn} from "./grid-column";
export class GridOptions {
  findFunction: Function = new Function;            // Input - filter, output - array of entities
  doubleClickFunction: Function = new Function;     // Input - entity, output - void
  afterProcessing: Function = new Function;         // Input - array of entities, output - array of entities
  columns: Array<GridColumn> = [];
  defaultSortProperty: string;
}
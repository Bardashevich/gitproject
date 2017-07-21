export class GridColumn {
  name: string;
  propertyName: string;
  width: string;
  sortable: boolean = true;
  sortPropertyName: string;


  constructor(name: string, propertyName: string, width: string, sortable: boolean, sortPropertyName: string) {
    this.name = name;
    this.propertyName = propertyName;
    this.width = width;
    this.sortable = sortable;
    this.sortPropertyName = sortPropertyName;
  }
}
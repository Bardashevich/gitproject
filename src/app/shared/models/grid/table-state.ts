export class TableState {
  count: number;
  from: number;
  sortAsc: boolean;
  sortProperty: string;
  text: string;

  constructor(sortProperty:string) {
    this.count = 20;
    this.from = 0;
    this.sortAsc = true;
    this.sortProperty = sortProperty;
    this.text = '';
  }
}
import {Component, Input} from '@angular/core';
import any = jasmine.any;
import {GridEntity} from "../../../shared/models/grid/grid-entity";
import {TableState} from "../../../shared/models/grid/table-state";
import {GridOptions} from "../../../shared/models/grid/grid-options";

@Component({
  selector: 'def-grid',
  templateUrl: 'def-grid.component.html',
  styleUrls: ['def-grid.component.scss']
})
export class DefaultGridComponent<T extends GridEntity> {
  totalCount: number;
  filter: TableState;

  @Input() gridOptions: GridOptions;

  entities: Array<T> = [];
  COUNT: number = 20;
  countPage: number;
  currentPage: number;
  pageIndexes: Array<number>;
  showSpinner: boolean = false;


  constructor() {
    this.filter = new TableState(null);
  }

  ngOnInit() {
    this.filter.sortProperty = this.gridOptions.defaultSortProperty;
    this.currentPage = 1;
    this.find();
  }

  sortColumn(column) {
    if (!column.sortable) {
      return;
    }
    if (this.filter.sortProperty == column.sortPropertyName) {
      this.filter.sortAsc = !this.filter.sortAsc;
    } else {
      this.filter.sortProperty = column.sortPropertyName;
      this.filter.sortAsc = true;
    }
    this.find();
  }

  toggleSelection(o) {
    o.selected = !o.selected;
  }

  toggleAll() {
    let selected = !this.isAllChecked();
    this.entities.forEach(x => x.selected = selected)
  }

  isAnyChecked() {
    if (this.entities) {
      return this.entities.some(_ => _.selected);
    }
  }

  countSelectedItems() {
    return this.entities.filter(_ => _.selected).length;
  }

  isAllChecked() {
    return this.entities && this.entities.length > 0 && this.entities.every(_ => _.selected);
  }

  changePage(index) {
    this.currentPage = index;
    this.filter.from = (index - 1) * this.COUNT;
    this.find();
  }

  applyTextFilter() {
    this.currentPage = 1;
    this.find();
  }

  find() {
    this.showSpinner = true;
    this.gridOptions.findFunction(this.filter).finally(() => this.showSpinner = false).subscribe(response => {
      this.entities = this.gridOptions.afterProcessing(response.data);
      this.totalCount = response.totalCount;
      this.countPage = (this.totalCount % this.COUNT === 0 ? 0 : 1) + (this.totalCount / this.COUNT | 0 );
      this.countPage = this.countPage === 0 ? 1 : this.countPage;
      this.pageIndexes = (new Array(this.countPage)).fill(0).map((x,i) => i + 1);
      if (this.countPage < this.currentPage) {
        this.currentPage = this.countPage;
      }
    });
  }
}

import {
  Component, trigger, state, style, transition, animate, ViewChild, ElementRef,
  Input
} from '@angular/core';
import {DefaultGridComponent} from "../def-grid/def-grid.component";
import {GridHeaderOptions} from "../../../shared/models/grid/grid-header-options";
import {GridEntity} from "../../../shared/models/grid/grid-entity";

@Component({
  selector: 'def-grid-header',
  animations: [
    trigger('state', [
      state('void', style({
        'width': '0',
        'border-bottom': '1px solid transparent'
      })),
      state('hide', style({
        'width': '0',
        'border-bottom': '1px solid transparent'
      })),
      state('search', style({
        'width': '170px'
      })),
      transition('* <=> *', animate('.3s 0 ease-in-out'))
    ])
  ],
  templateUrl: 'def-grid-header.component.html',
  styleUrls: ['def-grid-header.component.scss']
})
export class DefaultGridHeaderComponent<T extends GridEntity> {
  @Input() gridComponent: DefaultGridComponent<T>;
  @Input() gridHeaderOptions: GridHeaderOptions = new GridHeaderOptions;

  @ViewChild('searchInput') inputElement:ElementRef;
  hideSearchInput: boolean = true;

  constructor() {
    this.state = 'hide';
  }

  toggleInput() {
    this.state = this.state == 'search' ? 'hide' : 'search';

    if (this.state == 'search') {
      this.inputElement.nativeElement.focus();
    }
  }

  isAnyChecked() {
    if (this.gridComponent.entities) {
      return this.gridComponent.entities.some(_ => _.selected);
    }
  }

  get countSelectedItems() {
    return this.gridComponent.entities.filter(_ => _.selected).length;
  }

  state: 'hide' | 'search';

  search(text) {
    this.gridComponent.filter.text = text;
    this.gridComponent.find();
  }

  filterActions(selectedMode: boolean) {
    return this.gridHeaderOptions.actions.filter(_ => _.selectedMode === selectedMode);
  }
}

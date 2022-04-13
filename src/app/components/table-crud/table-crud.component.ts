import { Component, Input, EventEmitter, Output } from '@angular/core';
import {
  TableColumn,
  TableColumnAction,
  TableDataSource,
} from '../../interfaces/table-column';

@Component({
  selector: 'app-table-crud',
  templateUrl: './table-crud.component.html',
  styleUrls: ['./table-crud.component.css'],
})
export class TableCrudComponent {
  @Input() columns!: TableColumn[];
  @Input() dataSource!: TableDataSource;
  @Input() title!: string;
  @Output() eventEmitAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() eventEmitPage: EventEmitter<number> = new EventEmitter<number>();

  action: TableColumnAction = {} as TableColumnAction;
  dataOffset: number = 0;
  dataTotal: number = 0;

  constructor() {}

  onAction(action: string, data: any = null): void {
    this.action.action = action;
    this.action.data = data;
    this.eventEmitAction.emit(this.action);
  }

  onSetPage(page: number) {
    this.eventEmitPage.emit(page);
  }
}

export interface TableColumn {
  title: string;
  field: string;
}

export interface TableColumnAction {
  action: string;
  data: any;
}
export interface TableDataSource {
  dataset: any[];
  meta: any;
}

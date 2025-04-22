import { DataIndexInterface } from "./data-index";

export interface DataTypeInterface {
  id: number;
  include: boolean;
  label: string; // TODO remove
  type: string; // TODO remove
  columnName: string; // TODO remove
  columnFilter: string;
  orGroup?: number;
  parentLeafQueryId?: number;
  children: DataTypeInterface[];
  dataIndex?: DataIndexInterface;
}
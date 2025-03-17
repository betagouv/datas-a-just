import { DataTypeInterface } from "./data-type";

export interface LeafInterface {
    id: number;
    name: string;
    aliasName: string;
    datasFilters: DataTypeInterface[];
    datasCounted: DataTypeInterface[];
}
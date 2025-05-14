import { DataTypeInterface } from "./data-type";

export interface LeafInterface {
    id: number;
    name: string;
    aliasName: string;
    version: number;
    datasFilters: DataTypeInterface[];
    datasCounted: DataTypeInterface[];
}
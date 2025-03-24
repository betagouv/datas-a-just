import { LeafInterface } from "./leaf.interfaces";

export interface BranchInterface {
    id: number;
    name: string;
    aliasName: string;
    version: number;
    children?: BranchInterface[];
    leafs: LeafInterface[];
}
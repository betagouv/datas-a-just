export interface BranchInterface {
    id: number;
    name: string;
    aliasName: string;
    version: number;
    children?: BranchInterface[];
}
import { inject, Injectable } from '@angular/core';
import { ServerService } from '../http-server/server.service';
import { LeafInterface } from '../../interfaces/leaf.interfaces';
import { BranchInterface } from '../../interfaces/branch.interfaces';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  serverService = inject(ServerService);

  getLeafs() {
    return this.serverService.get(`leafs/list`);
  }

  addLeaf() {
    return this.serverService.post(`leafs/add`, { name: 'Nouvelle feuille' });
  }

  getLeafDetails(id: string) {
    return this.serverService.get(`leafs/get-details/${id}`);
  }

  saveLeaf(leaf: LeafInterface) {
    return this.serverService.put(`leafs/save`, leaf);
  }

  previewLeaf(leaf: LeafInterface) {
    return this.serverService.put(`leafs/preview`, leaf);
  }

  getBranchs() {
    return this.serverService.get(`branchs/list`);
  }

  getAllBranchs(id: string | null = null) {
    return this.serverService.post(`branchs/all-list`, { id });
  }

  getBranchDetail(id: string) {
    return this.serverService.get(`branchs/get-details/${id}`);
  }

  saveBranch(branch: BranchInterface) {
    return this.serverService.put(`branchs/save`, branch);
  }
}

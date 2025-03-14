import { inject, Injectable } from '@angular/core';
import { ServerService } from '../http-server/server.service';
import { LeafInterface } from '../../interfaces/leaf.interfaces';

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
}

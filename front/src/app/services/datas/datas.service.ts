import { inject, Injectable, signal } from '@angular/core';
import { ServerService } from '../http-server/server.service';
import { DataTypeInterface } from '../../interfaces/data-type';
import { sortBy } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class DatasService {
  serverService = inject(ServerService);
  dataTypes = signal<DataTypeInterface[]>([]);

  constructor() {
    this.onLoad();
  }

  async onLoad() {
    const dataTypes = await this.getTypeOfDatas();
    this.dataTypes.set(sortBy(dataTypes, 'label'));
  }

  getTypeOfDatas() {
    return this.serverService.get(`datas/datas-types-list`);
  }

  getDatasList(columnName: string) {
    return this.serverService.get(`datas/datas-list/${columnName}`);
  }
}

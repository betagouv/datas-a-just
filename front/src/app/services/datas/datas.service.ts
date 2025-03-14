import { inject, Injectable } from '@angular/core';
import { ServerService } from '../http-server/server.service';

@Injectable({
  providedIn: 'root',
})
export class DatasService {
  serverService = inject(ServerService);

  getTypeOfDatas() {
    return this.serverService.get(`datas/datas-types-list`);
  }
}

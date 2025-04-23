import { inject, Injectable } from '@angular/core';
import { ServerService } from '../http-server/server.service';

@Injectable({
  providedIn: 'root',
})
export class QueriesService {
  serverService = inject(ServerService);

  getBranchPreview(branchId: number, customQuery: string = "") {
    return this.serverService.get(`queries/request?b=${branchId}&type=branchs-preview${customQuery ? `&${customQuery}` : ''}`, { queryUrl: true });
  }
}

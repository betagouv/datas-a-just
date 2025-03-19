import { Component, inject } from '@angular/core';
import { TreeService } from '../../services/tree/tree.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BranchInterface } from '../../interfaces/branch.interfaces';

/**
 * Page de qui sommes nous
 */

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './branchs.page.html',
  styleUrls: ['./branchs.page.scss'],
})
export class BranchsPage {
  treeService = inject(TreeService);
  branchs: BranchInterface[] = [];

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.treeService.getBranchs().then((branchs) => {
      this.branchs = branchs;
    });
  }
}

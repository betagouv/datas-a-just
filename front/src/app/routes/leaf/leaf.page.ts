import { Component, inject } from '@angular/core';
import { TreeService } from '../../services/tree/tree.service';
import { LeafInterface } from '../../interfaces/leaf.interfaces';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Page de qui sommes nous
 */

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './leaf.page.html',
  styleUrls: ['./leaf.page.scss'],
})
export class LeafPage {
  treeService = inject(TreeService);
  leaf: LeafInterface | null = null;

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    /*this.treeService.getLeafs().then((leafs) => {
      this.leafs = leafs;
    });*/
  }
}

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
  templateUrl: './leafs.page.html',
  styleUrls: ['./leafs.page.scss'],
})
export class LeafsPage {
  treeService = inject(TreeService);
  leafs: LeafInterface[] = [];

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.treeService.getLeafs().then((leafs) => {
      this.leafs = leafs;
    });
  }

  onAddLeaf() {
    this.treeService.addLeaf().then(() => {
      this.onLoad();
    });
  }
}

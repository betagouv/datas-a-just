import { Component, inject } from '@angular/core';
import { TreeService } from '../../services/tree/tree.service';
import { LeafInterface } from '../../interfaces/leaf.interfaces';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatasService } from '../../services/datas/datas.service';
import { DataTypeInterface } from '../../interfaces/data-type';

/**
 * Page de qui sommes nous
 */

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './leaf.page.html',
  styleUrls: ['./leaf.page.scss'],
})
export class LeafPage {
  treeService = inject(TreeService);
  datasService = inject(DatasService);
  private activatedRoute = inject(ActivatedRoute);
  leaf: LeafInterface | null = null;
  dataTypes: DataTypeInterface[] = [];

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    const id = this.activatedRoute.snapshot.params['id'];

    this.treeService.getLeafDetails(id).then((leaf) => {
      this.leaf = leaf;
    });
    this.datasService.getTypeOfDatas().then((dataTypes) => {
      this.dataTypes = dataTypes;
    });
  }
}

import { Component, inject } from '@angular/core';
import { TreeService } from '../../services/tree/tree.service';
import { LeafInterface } from '../../interfaces/leaf.interfaces';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { chooseFile } from '../../utils/file';
import { AppService } from '../../services/app/app.service';

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
  appService = inject(AppService);
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

  async chooseLeafImport() {
    const file = await chooseFile('.yml');
    if (file) {
      this.appService.appLoading.set(true);
      await this.treeService.uploadFile(file);
      this.onLoad();
      this.appService.appLoading.set(false);
    }
  }

  async chooseDictionaryImport() {
    const file = await chooseFile('.xml');
    if (file) {
      this.appService.appLoading.set(true);
      await this.treeService.uploadDictionary(file);
      this.appService.appLoading.set(false);
    }
  }
}

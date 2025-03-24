import { Component, inject } from '@angular/core';
import { TreeService } from '../../services/tree/tree.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BranchInterface } from '../../interfaces/branch.interfaces';
import { FormsModule } from '@angular/forms';
import { BranchViewComponent } from '../../components/branch-view/branch-view.component';
import { LeafInterface } from '../../interfaces/leaf.interfaces';
import { LeafViewComponent } from "../../components/leaf-view/leaf-view.component";

/**
 * Page de qui sommes nous
 */

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, BranchViewComponent, LeafViewComponent],
  templateUrl: './edit-branch.page.html',
  styleUrls: ['./edit-branch.page.scss'],
})
export class EditBranchPage {
  treeService = inject(TreeService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  branch: BranchInterface | null = null;
  allBranchs: BranchInterface[] = [];
  allLeafs: LeafInterface[] = [];

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    const id = this.activatedRoute.snapshot.params['id'];

    this.treeService.getBranchDetail(id).then((branch) => {
      if (branch) {
        this.branch = branch;
      } else {
        this.branch = {
          id: -1,
          name: '',
          aliasName: '',
          version: 0,
          leafs: [],
        }
      }
    });

    this.treeService.getAllBranchs(id).then((branchs) => {
      this.allBranchs = branchs;
    });

    this.treeService.getLeafs().then((leafs) => {
      this.allLeafs = leafs;
    });
  }

  onSave() {
    if (this.branch) {
      this.treeService.saveBranch(this.branch).then(() => {
        this.router.navigate(['/branches']);
      });
    }
  }

  onCancel() {
    if (confirm('Voulez-vous vraiment annuler ?')) {
      this.router.navigate(['/branches']);
    }
  }

  onAddChild(selected: HTMLSelectElement) {
    const value = selected.value;
    if (value && this.branch) {
      const valueNumber = +value;

      const child = this.allBranchs.find(branch => branch.id === valueNumber);
      if (child) {
        const children = this.branch?.children || [];
        children.push(child);
        this.branch.children = [...children]
      }
    }
  }

  onAddLeaf(selected: HTMLSelectElement) {
    const value = selected.value;
    if (value && this.branch) {
      const valueNumber = +value;

      const child = this.allLeafs.find(l => l.id === valueNumber);
      if (child) {
        const children = this.branch?.leafs || [];
        children.push(child);
        this.branch.leafs = [...children]
      }
    }
  }

  getAvailabledLeafs() {
    return this.allLeafs.filter(l => !this.branch?.leafs.find(leaf => leaf.id === l.id));
  }
}

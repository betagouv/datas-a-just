import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BranchInterface } from '../../interfaces/branch.interfaces';
import { TreeService } from '../../services/tree/tree.service';

@Component({
  selector: 'branch-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-view.component.html',
  styleUrls: ['./branch-view.component.scss'],
})
export class BranchViewComponent implements OnInit {
  treeService = inject(TreeService);
  @Input() branch: BranchInterface | null = null;
  @Input() editabled: boolean = false;
  allBranchs: BranchInterface[] = [];

  ngOnInit() {
    if (this.editabled) {
      this.treeService.getAllBranchs().then((branchs) => {
        this.allBranchs = branchs;
      });
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
}

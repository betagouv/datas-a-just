import { Component, inject, ViewChild } from '@angular/core';
import { TreeService } from '../../services/tree/tree.service';
import { LeafInterface } from '../../interfaces/leaf.interfaces';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  @ViewChild('filterType') filterType: any;
  leaf: LeafInterface | null = null;
  dataTypes: DataTypeInterface[] = [];
  lines: any[] = [];
  linesHeaders: { label: string, value: string }[] = [];

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

  onAddFilter() {
    if (this.filterType && this.filterType.nativeElement) {
      const dataType = this.dataTypes.find(
        (dataType) => dataType.id === +this.filterType.nativeElement.value
      );
      if (dataType && this.leaf) {
        this.leaf.datasFilters = this.leaf.datasFilters || [];
        this.leaf.datasFilters.push({
          id: -1,
          include: true,
          label: dataType.label,
          type: "filter",
          columnName: dataType.columnName,
          columnFilter: "",
        });
      }
    }
  }

  onSave() {
    if (this.leaf) {
      this.treeService.saveLeaf(this.leaf).then(() => {
        this.router.navigate(['/feuilles']);
      });
    }
  }

  onCancel() {
    if (confirm('Voulez-vous vraiment annuler ?')) {
      this.router.navigate(['/feuilles']);
    }
  }

  onPreview() {
    if (this.leaf) {
      this.treeService.previewLeaf(this.leaf).then((lines: any) => {
        console.log(lines);
        this.lines = lines;
        this.linesHeaders = Object.keys(lines[0]).map((key) => {
          const type = this.dataTypes.find((dataType) => dataType.columnName === key);
          if (type) { return { label: type.label, value: key }; }
          return { label: key, value: key };
        });
      });
    }
  }
}

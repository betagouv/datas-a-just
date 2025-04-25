import { Component, EventEmitter, inject, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatasService } from '../../../services/datas/datas.service';
import { DataTypeInterface } from '../../../interfaces/data-type';
import { sortBy } from 'lodash';

@Component({
  selector: 'app-leaf-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leaf-data.component.html',
  styleUrls: ['./leaf-data.component.scss'],
})
export class LeafDataComponent implements OnChanges {
  datasService = inject(DatasService);
  @ViewChild('filterType') filterType: any;
  @Input() filter: DataTypeInterface | null = null;
  @Input() isChild = false;
  @Output() onRemove = new EventEmitter();
  lines: { value: string; count: number }[] = [];

  ngOnChanges() {
    console.log('filter', this.filter);
    this.onLoad();
  }

  onLoad() {
    if (this.filter) {
      this.datasService.getDatasList(this.filter.columnName).then((datas) => {
        this.lines = sortBy(datas, 'value');
      });
    }
  }

  isMatch(value: string) {
    if (this.filter && this.filter.columnFilter) {
      const regex = new RegExp(this.filter.columnFilter, 'i');
      return regex.test(value);
    }

    return false;
  }

  onAddOr() {
    if (this.filterType && this.filterType.nativeElement) {
      const dataType = this.datasService.dataTypes().find(
        (dataType) => dataType.id === +this.filterType.nativeElement.value
      );
      if (dataType && this.filter) {
        this.filter.children = this.filter.children || [];
        this.filter.children.push({
          id: (this.filter.children.length + 1) * -1,
          include: true,
          label: dataType.label,
          type: "filter",
          columnName: dataType.columnName,
          columnFilter: "",
          children: [],
        });
      }
    }
  }

  onIncludeChange(event: any) {
    if (this.filter) {
      this.filter.include = event.target.checked;
    }
  }
}

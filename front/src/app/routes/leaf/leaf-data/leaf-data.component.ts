import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
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
  @Input() filter: DataTypeInterface | null = null;
  @Output() onRemove = new EventEmitter();
  lines: { value: string; count: number }[] = [];

  ngOnChanges() {
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

}

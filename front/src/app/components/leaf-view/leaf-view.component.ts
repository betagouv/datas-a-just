import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeService } from '../../services/tree/tree.service';
import { LeafInterface } from '../../interfaces/leaf.interfaces';

@Component({
  selector: 'leaf-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leaf-view.component.html',
  styleUrls: ['./leaf-view.component.scss'],
})
export class LeafViewComponent {
  treeService = inject(TreeService);
  @Input() leaf: LeafInterface | null = null;
}

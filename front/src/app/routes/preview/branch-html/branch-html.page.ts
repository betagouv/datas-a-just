import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './branch-html.page.html',
  styleUrls: ['./branch-html.page.scss'],
})
export class BranchHTMLPage {
  title = inject(Title);

  /**
   * Constructeur
   */
  constructor() {
    this.title.setTitle('Prévisualisation de la page blanche');
  }
}

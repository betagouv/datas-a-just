import {
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { MainClass } from '../../libs/main-class';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';


/**
 * Composent de mise en page en mode connecté
 */

@Component({
  selector: 'aj-wrapper',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatMenuModule,
    MatProgressBarModule,
  ],
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent extends MainClass implements OnDestroy {
  /**
   * Titre de page
   */
  @Input() title: string = '';
  constructor(
    private router: Router,
  ) {
    super();
  }

  /**
   * A la destruction du composant supprimer les watcher
   */
  ngOnDestroy() {
    this.watcherDestroy();
  }

  /**
   * Bouton déconnecter
   */
  onDisconnect() {
    this.router.navigate(['/logout']);
  }
}

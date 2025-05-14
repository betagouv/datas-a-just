import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppService } from './services/app/app.service';
import { BigLoaderComponent } from './components/big-loader/big-loader.component';

/**
 * Composant principal du projet
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BigLoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  appService = inject(AppService);
}

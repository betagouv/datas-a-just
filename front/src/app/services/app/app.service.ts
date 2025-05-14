import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service d'outil généraux qui concerne l'APP, chez nous ce n'est que l'alerte
 */

@Injectable({
  providedIn: 'root',
})
export class AppService {
  /**
   * Mettre à mettre en alert
   */
  alert: BehaviorSubject<any | null> =
    new BehaviorSubject<any | null>(null);
  /**
   * Cache previous URL
   */
  previousUrl: string | null = null;
  /**
   * Cache current URL
   */
  currentUrl: string | null = null;
  /**
   * Mettre à mettre en alert
   */
  tooltipsOpenId: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  /**
   * Mettre un grand loader
   */
  appLoading = signal(false);
}

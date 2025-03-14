import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServerService } from '../http-server/server.service';
import { Router } from '@angular/router';
import { UserInterface } from '../../interfaces/user-interface';

/**
 * Service de sauvegarde de l'utilisateur actuel
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  router = inject(Router);
  serverService = inject(ServerService);
  /**
   * Format de l'utilisateur connecté
   */
  user: BehaviorSubject<UserInterface | null> =
    new BehaviorSubject<UserInterface | null>(null);
  /**
   * User infos to signal
   */
  userOriginalS = signal<UserInterface | null>(null);
  /**
   * User infos to signal
   */
  userS = signal<UserInterface | null>(null);

  /**
   * Interface front TJ ou CA
   */
  interfaceType: number | null = null;

  constructor() {
    this.user.subscribe((s) => {
      this.userS.set(
        s
          ? {
            ...s,
            initials:
              (s.firstName || '').charAt(0) + (s.lastName || '').charAt(0),
          }
          : s
      );
    });
  }

  /**
   * Sauvegarde d'une utilisateur
   * @param user
   */
  setUser(user: UserInterface | null) {
    this.user.next(user);

    if (user && user.token) {
      this.serverService.setToken(user.token);
    }
  }

  /**
   * API Identification de qui est l'utilisateur connecté
   * @returns
   */
  me() {
    return this.serverService
      .getWithoutError('users/me')
      .then((data) => data.data || null);
  }

  /**
   * API Inscription d'un nouveau utilisateur
   * @param params
   * @returns
   */
  register(params = {}): Promise<any> {
    return this.serverService
      .post('users/create-account', params)
      .then((data) => {
        this.serverService.setToken(data.token);
        return data;
      });
  }

  /**
   * API demande de nouveau mot de passe
   * @param params
   * @returns
   */
  forgotPassword(params = {}): Promise<any> {
    return this.serverService
      .post('users/forgot-password', params)
      .then((data) => data.data || null);
  }

  /**
   * API changement du mot de passe avec code
   * @param params
   * @returns
   */
  changePassword(params = {}): Promise<any> {
    return this.serverService
      .post('users/change-password', params)
      .then((data) => data.data || null);
  }

  /**
   * API Logout avec suppression du token coté serveur
   * @returns
   */
  logout() {
    return this.serverService.get('auths/logout').then(() => {
      this.user.next(null);
      this.serverService.removeToken();
    });
  }
}

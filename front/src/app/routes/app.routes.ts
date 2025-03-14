import { Routes } from '@angular/router';

export const routes: Routes = [
  /*{
    path: 'login',
    redirectTo: '/connexion',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: '/connexion',
    pathMatch: 'full',
  },
  {
    path: 'connexion',
    loadComponent: () =>
      import('./login/login.page').then((mod) => mod.LoginPage),
  },*/
  {
    path: 'feuilles',
    loadComponent: () =>
      import('./leafs/leafs.page').then((mod) => mod.LeafsPage),
  },
  {
    path: 'editer-feuille/:id',
    loadComponent: () =>
      import('./leaf/leaf.page').then((mod) => mod.LeafPage),
  },
  {
    path: '**',
    redirectTo: '/connexion',
    pathMatch: 'full',
  },
];

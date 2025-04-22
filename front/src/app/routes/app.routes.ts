import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/feuilles',
    pathMatch: 'full',
  },
  /*{
    path: 'login',
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
    path: 'branches',
    loadComponent: () =>
      import('./branchs/branchs.page').then((mod) => mod.BranchsPage),
  },
  {
    path: 'editer-branche/:id',
    loadComponent: () =>
      import('./edit-branch/edit-branch.page').then((mod) => mod.EditBranchPage),
  },
  {
    path: 'preview/html/:id',
    loadComponent: () =>
      import('./preview/branch-html/branch-html.page').then((mod) => mod.BranchHTMLPage),
  },
  /*{
    path: '**',
    redirectTo: '/connexion',
    pathMatch: 'full',
  },*/
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'topics/:id',
    loadComponent: () =>
      import('./features/topics/pages/topic-detail/topic-detail').then((m) => m.TopicDetail),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/pages/home/home').then((m) => m.Home),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
  }
];

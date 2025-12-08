import { Routes } from '@angular/router';
import { Profile } from './pages/profile/profile';
import { Home } from './pages/home/home';

export const routes: Routes = [
    {
        path: 'profile/:id',
        component: Profile,
        title: 'Profile'
    },
  {
    path: 'topics/:id',
    loadComponent: () =>
      import('./features/topics/pages/topic-detail/topic-detail').then((m) => m.TopicDetail),
  },
  {
    path: '',
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

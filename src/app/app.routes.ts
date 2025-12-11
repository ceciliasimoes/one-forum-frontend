import { Routes } from '@angular/router';
import { Profile } from './features/profile/profile';
import { inject } from '@angular/core';
import { TokenService } from './core/services/token.service';
import { Router } from '@angular/router';

const redirectIfAuthenticated = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getAccessToken()) {
    router.navigate(['/']);
    return false;
  }
  return true;
};

const requireAuthentication = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.getAccessToken()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () => import('./features/splash/splash').then((m) => m.Splash),
    canActivate: [redirectIfAuthenticated],
    title: 'Welcome - One Forum',
  },
  {
    path: 'profile/:id',
    component: Profile,
    title: 'Perfil de Usuário',
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [requireAuthentication],
    title: 'Meu Perfil',
  },
  {
    path: 'topics/:id',
    loadComponent: () =>
      import('./features/topics/pages/topic-detail/topic-detail').then((m) => m.TopicDetail),
  },
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home').then((m) => m.Home),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register').then((m) => m.Register),
    // canActivate: [redirectIfAuthenticated],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
    canActivate: [redirectIfAuthenticated],
  },
  {
    path: 'confirm-account',
    loadComponent: () =>
      import('./features/confirm-account-alert/confirm-account-alert').then(
        (m) => m.ConfirmAccountAlert
      ),
  },
  {
    path: '**',
    redirectTo: 'splash',
  },
];

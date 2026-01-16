import { Routes } from '@angular/router';
import { Profile } from './features/profile/profile';
import { inject } from '@angular/core';
import { TokenService } from './core/services/token.service';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from './core/services/auth.service';
import { filter, map, take } from 'rxjs';

const redirectIfAuthenticated = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getAccessToken()) {
    router.navigate(['/home']);
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

const checkUserLoaded = () => {
  const authService = inject(AuthService);
  return toObservable(authService.authCheckCompleted)
  .pipe(
    filter(value => value === true),
    take(1),
    map(() => true)
  )
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/splash/splash').then((m) => m.Splash),
    canActivate: [redirectIfAuthenticated],
    title: 'Welcome - One Forum',
  },
  {
    path: 'splash',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/pages/home/home').then((m) => m.Home),
    title: 'Home - One Forum',
  },
  {
    path: 'profile/:id',
    component: Profile,
    resolve: {
      authData: checkUserLoaded
    },
    title: 'Perfil de Usuário',
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [requireAuthentication],
    resolve: {
      authData: checkUserLoaded
    },
    title: 'Meu Perfil',
  },
  {
    path: 'topics/:id',
    loadComponent: () =>
      import('./features/topics/pages/topic-detail/topic-detail').then((m) => m.TopicDetail),
    canActivate: [requireAuthentication],
    title: 'Tópico - One Forum',
  },
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home').then((m) => m.Home),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register').then((m) => m.Register),
    canActivate: [redirectIfAuthenticated],
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
    redirectTo: '',
    pathMatch: 'full',
  },
];

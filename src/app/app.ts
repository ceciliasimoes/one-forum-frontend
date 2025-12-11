import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Topbar } from "./shared/components/topbar/topbar";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Topbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('one-forum-frontend');
  private router = inject(Router);

  routerEvent = toSignal(this.router.events
    .pipe(filter(event => event instanceof NavigationEnd)),
    {initialValue: {urlAfterRedirects: ''} as NavigationEnd}
  );

  haveTopBar = computed(() => {
    const endpoint = this.routerEvent().urlAfterRedirects.split("?");
    return !this.noTopbarEndpoints.find(el => el === endpoint[0]);
  })

  noTopbarEndpoints: String[] = [
    "/login",
    "/register",
    "/confirm-account"
  ]
}

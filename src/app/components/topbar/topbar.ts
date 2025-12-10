import { Component, computed, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import * as StringUtils from '../../shared/utils/string.utils'
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-topbar',
  imports: [MatToolbarModule, RouterLink, MatIcon],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private authService = inject(AuthService);

  isLogged = toSignal(this.authService.isLogged$);
  currentUser = computed(() => this.authService.currentUser());

  getUserInitials(): String {
    return StringUtils.getInitials(this.currentUser()?.profileName) || '';
  }
}

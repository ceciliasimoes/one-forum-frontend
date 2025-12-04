import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userState = signal({
    userId: 1,
    userName: 'Pedro'
  })

  isUserAuthenticated(): boolean {
    return true;
  }

  getUserId() {
    return this.userState().userId;
  }
}

import {Component, signal} from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AuthenticationService } from "../shared/authentication.service";
import {User} from '../shared/user';
import {TutoringService} from '../shared/tutoring.service';

@Component({
  selector: 'bs-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
  currentUserId = signal<number | null>(null);
  currentUser = signal<User | null>(null);

  constructor(
    private authService: AuthenticationService,
    private tutoringService: TutoringService
  ) {
    if (this.authService.isLoggedIn()) {
      const id = this.authService.getCurrentUserId();
      this.currentUserId.set(id);

      this.loadUser(id);
    }
  }


  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }


  loadUser(id: number) {
    this.tutoringService.getUserById(id).subscribe({
      next: (user) => {
        this.currentUser.set(user);
      },
      error: (err) => {
        console.error('Userdaten konnten nicht geladen werden', err);
        this.currentUser.set(null);
      }
    });
  }

  getLoginLabel(): string {
    return this.isLoggedIn() ? "Logout" : "Login";
  }

  logout(): void {
    this.authService.logout();
    this.currentUserId.set(null);
  }

}

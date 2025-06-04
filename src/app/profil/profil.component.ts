import {Component, OnInit, signal} from '@angular/core';
import {User} from '../shared/user';
import {AuthenticationService} from '../shared/authentication.service';
import {TutoringService} from '../shared/tutoring.service';
import {ProfilContainerComponent} from '../profil-container/profil-container.component';
import {RouterLink} from '@angular/router';
import {AcceptedAppointmentsComponent} from '../accepted-appointments/accepted-appointments.component';


@Component({
  selector: 'bs-profil',
  templateUrl: './profil.component.html',
  imports: [
    ProfilContainerComponent,
    RouterLink,
    AcceptedAppointmentsComponent,
  ],
  styles: ``
})
export class ProfileComponent implements OnInit {
  currentUserId = signal<number | null>(null);
  currentUser = signal<User | null>(null);
  role = signal<string | null>(null);
  constructor(
    private authService: AuthenticationService,
    private tutoringService: TutoringService
  ) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const id = this.authService.getCurrentUserId();
      this.currentUserId.set(id);
      this.role.set(this.authService.getCurrentUserRole());
      this.loadUser(id);
    }
  }

  loadUser(id: number): void {
    this.tutoringService.getUserById(id).subscribe({
      next: (user: User) => {
        this.currentUser.set(user);
      },
      error: (err) => {
        console.error('Fehler beim Laden des Benutzers:', err);
        this.currentUser.set(null);
      },
    });
  }
}

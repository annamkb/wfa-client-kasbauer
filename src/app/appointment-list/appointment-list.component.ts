import { Component, signal, effect } from '@angular/core';
import { Appointment } from '../shared/appointment';
import { AppointmentContainerComponent } from '../appointment-container/appointment-container.component';
import { AppointmentListItemComponent } from '../appointment-list-item/appointment-list-item.component';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { AppointmentStatusFilterComponent } from '../appointment-status-filter/appointment-status-filter.component';
import { TutoringService } from '../shared/tutoring.service';
import { User } from '../shared/user';

@Component({
  selector: 'bs-appointment-list',
  standalone: true,
  imports: [
    AppointmentContainerComponent,
    AppointmentListItemComponent,
    RouterLink,
    AppointmentStatusFilterComponent,
  ],
  templateUrl: './appointment-list.component.html',
})
export class AppointmentListComponent {
  appointments = signal<Appointment[] | null>(null);
  isLoading = signal(true);
  isLoggedIn = signal(false);
  currentUserId = signal<number | null>(null);
  currentUser = signal<User | null>(null);
  selectedStatus = signal<string | ''>('');

  constructor(
    private authService: AuthenticationService,
    private tutoringService: TutoringService
  ) {
    const loggedIn = this.authService.isLoggedIn();
    this.isLoggedIn.set(loggedIn);

    if (loggedIn) {
      const id = this.authService.getCurrentUserId();
      this.currentUserId.set(id);

      this.tutoringService.getUserById(id).subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.loadAppointments();
        },
        error: () => {
          this.currentUser.set(null);
          this.isLoading.set(false);
        },
      });
    }
  }

  onStatusSelected(status: string | null): void {
    this.selectedStatus.set(status ?? '');
    this.loadAppointments();
  }


  loadAppointments(): void {
    this.isLoading.set(true);

    const user = this.currentUser();
    const isStudent = user?.role === 'student';
    const status = this.selectedStatus();

    const request = isStudent && user?.id != null
      ? this.tutoringService.getFilteredAppointmentsForStudent(status)
      : this.tutoringService.getAppointments();

    request.subscribe({
      next: (apps) => {
        if (Array.isArray(apps)) {
          this.appointments.set(apps);
        } else {
          this.appointments.set([]);
        }
      },
      error: () => this.appointments.set([]),
      complete: () => this.isLoading.set(false),
    });

  }
}

import {Component, Input, OnInit, signal} from '@angular/core';
import { AppointmentContainerComponent } from '../appointment-container/appointment-container.component';
import { AppointmentListItemComponent } from '../appointment-list-item/appointment-list-item.component';
import { Appointment } from '../shared/appointment';
import { TutoringService } from '../shared/tutoring.service';
import { AuthenticationService } from '../shared/authentication.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bs-filtered-appointment-list',
  standalone: true,
  templateUrl: './filtered-appointment-list.component.html',
  imports: [
    AppointmentContainerComponent,
    AppointmentListItemComponent,
    RouterLink
  ]
})
export class FilteredAppointmentListComponent implements OnInit {
  @Input() appointments: Appointment[] = [];
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private tutoringService: TutoringService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadAppointmentsForCurrentUser();
  }

  private loadAppointmentsForCurrentUser(): void {
    this.loading.set(true);
    this.error.set(null);
    this.appointments = [];

    const userId = this.authService.getCurrentUserId();
    const role = this.authService.getCurrentUserRole();

    if (!userId) {
      this.error.set('Kein eingeloggter Benutzer:innen gefunden.');
      this.loading.set(false);
      return;
    }

    if (role === 'teacher') {
      this.loadAppointmentsForTeacher(userId);
    } else {
      this.loadAppointmentsForStudent(userId);
    }
  }

  private loadAppointmentsForStudent(studentId: number): void {
    this.tutoringService.getAcceptedAppointmentsForStudent(studentId).subscribe({
      next: (data) => {
        const filtered = data.filter(appt =>
          ['offered', 'accepted', 'rejected'].includes(appt.status)
        );

        filtered.sort((a, b) =>
          new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
        );

        this.appointments = filtered;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Fehler beim Laden der Termine.');
        this.loading.set(false);
      }
    });
  }

  private loadAppointmentsForTeacher(teacherId: number): void {
    this.tutoringService.getAppointmentsForTeacher(teacherId).subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Fehler beim Laden der Termine.');
        this.loading.set(false);
      }
    });
  }
}

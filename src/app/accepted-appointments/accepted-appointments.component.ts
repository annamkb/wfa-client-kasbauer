import { Component, OnInit, signal } from '@angular/core';
import { TutoringService } from '../shared/tutoring.service';
import { Appointment } from '../shared/appointment';
import { AuthenticationService } from '../shared/authentication.service';
import { FilteredAppointmentListComponent } from '../filtered-appointment-list/filtered-appointment-list.component';

@Component({
  selector: 'bs-accepted-appointments',
  standalone: true,
  imports: [FilteredAppointmentListComponent],
  template: `
    <div class="flex flex-col gap-4">
      <h2>Akzeptierte Termine</h2>
      <p>Diese Termine sind gebucht und stehen als nächstes für dich an. Notiere dir deine Termine am besten im Kalender.</p>
      <bs-filtered-appointment-list [appointments]="appointments()"></bs-filtered-appointment-list>
    </div>

  `
})
export class AcceptedAppointmentsComponent implements OnInit {
  appointments = signal<Appointment[]>([]);

  constructor(
    private tutoringService: TutoringService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.tutoringService.getFilteredAppointmentsForStudent('accepted').subscribe({
      next: data => this.appointments.set(data),
      error: () => this.appointments.set([])
    });
  }
}

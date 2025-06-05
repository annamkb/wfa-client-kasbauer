import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { Offer } from '../shared/offer';
import { TutoringService } from '../shared/tutoring.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Appointment } from '../shared/appointment';
import { AuthenticationService } from '../shared/authentication.service';
import { User } from '../shared/user';
import { AppointmentStatusFilterComponent } from '../appointment-status-filter/appointment-status-filter.component';
import { FormsModule } from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'bs-offer-detail',
  standalone: true,
  imports: [RouterLink, AppointmentStatusFilterComponent, FormsModule, NgClass],
  templateUrl: './offer-detail.component.html',
  styles: ``
})
export class OfferDetailComponent implements OnInit {
  offer = signal<Offer | null>(null);
  appointments = signal<Appointment[] | null>(null);
  filteredAppointments = signal<Appointment[] | null>(null);
  isLoggedIn = signal(false);
  isOwnerTeacher = signal(false);
  own = signal(false);
  appointmentStatusFilter = signal<string | null>(null);

  currentUser = signal<{ id: number } | null>(null);
  userRole = signal<string | null>(null);
  user = signal<User | null>(null);

  rejectingId = signal<number | null>(null);
  rejectComment = signal<string>('');
  appointmentTimeFilter = signal<'all' | 'upcoming' | 'past'>('all');
  loading = signal(false);

  private router = inject(Router);

  constructor(
    private ts: TutoringService,
    protected as: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.isLoggedIn.set(this.as.isLoggedIn());

    const user = this.as.getCurrentUser();
    this.currentUser.set(user);
    this.userRole.set(this.as.getCurrentUserRole());

    if (user) {
      this.ts.getUserById(user.id).subscribe({
        next: (user) => {
          this.currentUser.set(user);

          if (this.userRole() === 'student') {
            this.ts.getSingle(id).subscribe((o: Offer) => {
              this.offer.set(o);
              this.loadFilteredAppointments();
            });
          }
        },
        error: () => {
          this.currentUser.set(null);
        }
      });
    } else {
      this.currentUser.set(null);
    }

    if (this.userRole() === 'teacher') {
      this.ts.getSingle(id).subscribe((o: Offer) => {
        this.offer.set(o);
        if (
          this.currentUser() &&
          o.user?.id === this.currentUser()?.id &&
          this.userRole() === 'teacher'
        ) {
          this.isOwnerTeacher.set(true);
        }
      });

      this.ts.getAppointmentsForOffer(id).subscribe((apps: Appointment[]) => {
        this.appointments.set(apps);
      });
    }

    const ownParam = this.route.snapshot.queryParamMap.get('own');
    this.own.set(ownParam === 'true');
  }

  onStatusSelected(status: string | null) {
    this.appointmentStatusFilter.set(status);
    this.loadFilteredAppointments();
  }

  loadFilteredAppointments() {
    this.loading.set(true);

    const user = this.currentUser();
    const offer = this.offer();

    if (!user || !offer) {
      this.filteredAppointments.set([]);
      return;
    }

    const timeFilter = this.appointmentTimeFilter();

    this.ts.getAppointmentsHistory(user.id).subscribe({
      next: ({ upcoming, past }) => {
        // Kombinieren und filtern
        const combined = [...upcoming, ...past];

        const relevantAppointments = combined.filter(app =>
          app.offer_id === offer.id &&
          (
            app.status === 'offered' ||
            (app.user_id === user.id && (app.status === 'accepted' || app.status === 'rejected'))
          )
        );

        const now = new Date();
        const final = relevantAppointments.filter(app => {
          const scheduledDate = new Date(app.scheduled_at);
          if (timeFilter === 'upcoming') return scheduledDate >= now;
          if (timeFilter === 'past') return scheduledDate < now;
          return true; // 'all'
        });

        this.filteredAppointments.set(final);
        this.loading.set(false);
      },
      error: () => {
        this.filteredAppointments.set([]);
        this.loading.set(false);
      }
    });
  }


  updateStatus(id: number, status: 'accepted' | 'rejected') {
    // Für 'rejected' soll Kommentar per submitRejection gesendet werden, daher hier nur 'accepted' benutzen
    if (status === 'accepted') {
      this.ts.updateAppointmentStatus(id, status).subscribe(() => {
        this.loadFilteredAppointments();
      });
    }
  }

  toggleReject(id: number) {
    if (this.rejectingId() === id) {
      this.rejectingId.set(null);
      this.rejectComment.set('');
    } else {
      this.rejectingId.set(id);
      this.rejectComment.set('');
    }
  }

  submitRejection(id: number) {
    const comment = this.rejectComment().trim();
    this.ts.updateAppointmentStatus(id, 'rejected', comment).subscribe(() => {
      this.rejectingId.set(null);
      this.rejectComment.set('');
      this.loadFilteredAppointments();
    });
  }

  removeOffer() {
    const offer = this.offer();
    if (offer && confirm('Offer wirklich löschen?')) {
      this.ts.remove(String(offer.id)).subscribe({
        next: () => {
          this.router.navigate(['../'], {
            relativeTo: this.route,
            queryParams: { own: this.own() }
          });
        },
        error: (err) => {
          alert(err.error?.message || 'Fehler beim Löschen.');
        }
      });
    }
  }

  currentUserId(): number | null {
    return this.currentUser()?.id ?? null;
  }

  setTimeFilter(filter: 'all' | 'upcoming' | 'past') {
    this.appointmentTimeFilter.set(filter);
    this.loadFilteredAppointments();
  }

}

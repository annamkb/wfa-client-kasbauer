import {Component, OnInit, signal} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthenticationService} from '../shared/authentication.service';
import {OfferFactory} from '../shared/offer-factory';
import {TutoringService} from '../shared/tutoring.service';
import {Offer, Subject} from '../shared/offer';
import {OfferFormErrorMessages} from './offer-form-error-messages';
import {OfferValidators} from '../shared/offer-validators';
import {forkJoin, Observable} from 'rxjs';
import {Appointment} from '../shared/appointment';
import {formatDateTimeForBackend} from '../shared/date-utils';

@Component({
  selector: 'bs-offer-form',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './offer-form.component.html',
  styles: ``
})
export class OfferFormComponent implements OnInit {
  offerForm: FormGroup;
  isUpdatingOffer: boolean = false;
  offer = OfferFactory.empty();
  errors: { [key: string]: string } = {};
  subjects = signal<Subject[]>([]);
  statuses = signal<string[]>([]);
  appointments: FormArray;
  isLoggedIn = signal(false);
  role = signal('');


  constructor(private fb: FormBuilder,
              private ts: TutoringService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthenticationService) {
    this.offerForm = this.fb.group({});
    this.appointments = this.fb.array([]);
  }

  ngOnInit() {
    this.isLoggedIn.set(this.authService.isLoggedIn());
    this.role.set(this.authService.getCurrentUserRole());

    this.statuses.set(['offered', 'accepted', 'rejected']);
    // initialisieren des formulars
    const id = this.route.snapshot.params["id"];
    const idnumber = Number(id);

    // if exists
    if (idnumber) {
      this.isUpdatingOffer = true;
      this.ts.getSingle(idnumber).subscribe(offer => {
        this.offer = offer;
        this.initOffer();
      });
    }

    // else neues anlegen
    this.ts.getSubjects().subscribe({
      next: subjects => this.subjects.set(subjects),
      error: err => console.error('Fehler beim Laden der Subjects', err)
    });
    this.initOffer();
  }

  initOffer() {
    this.buildAppointmentsArray();
    this.offerForm = this.fb.group({
      id: this.offer.id,
      description: [this.offer.description, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      subject_id: [this.offer.subject_id, [Validators.required, OfferValidators.subjectSelected]],
      appointments: this.appointments,
    })
    this.offerForm.statusChanges.subscribe(() => {
      this.updateErrorMessages();
    })
  }


  private buildAppointmentsArray() {
    this.appointments = this.fb.array([]);
    if (this.offer.appointments && this.offer.appointments.length > 0) {
      for (let appt of this.offer.appointments) {
        //schedulded_at splitting to date and time for better ux
        let date = '';
        let time = '';
        if (appt.scheduled_at) {
          const dt = new Date(appt.scheduled_at);
          date = dt.toISOString().slice(0, 10); // yyyy-mm-dd
          time = dt.toTimeString().slice(0, 5); // HH:mm
        }
        this.appointments.push(this.fb.group({
          id: [appt.id],
          date: [date, [Validators.required, OfferValidators.futureOrTodayDate]],
          time: [time, [Validators.required, OfferValidators.futureOrNowTime('date')]],
          status: [
            this.isUpdatingOffer && this.statuses().includes(appt.status) ? appt.status : 'offered',
            Validators.required
          ],
          comment: [appt.comment, Validators.maxLength(200)]
        }));
      }
    } else {
      // mindestens ein leerer Termin für neue Angebote
      this.addAppointmentControl();
    }
  }

  addAppointmentControl() {
    this.appointments.push(this.fb.group({
      id: [null],
      // scheduled_at: ['', Validators.required],
      date: ['', [Validators.required, OfferValidators.futureOrTodayDate]],
      time: ['', [Validators.required, OfferValidators.futureOrNowTime('date')]],
      status: ['offered', Validators.required],
      comment: ['', Validators.maxLength(200)],
    }));
  }

  removeAppointmentControl(index: number) {
    const appointment = this.appointments.at(index).value;

    if (appointment.id && this.isUpdatingOffer) {
      const confirmDelete = window.confirm('Möchtest du diesen Termin wirklich löschen?');
      if (!confirmDelete) {
        return;
      }

      this.ts.deleteAppointment(appointment.id).subscribe({
        next: () => {
          this.appointments.removeAt(index);
        },
        error: err => {
          console.error('Fehler beim Löschen des Termins:', err);
          alert('Fehler beim Löschen des Termins');
        }
      });
    } else {
      this.appointments.removeAt(index);
    }
  }



  updateErrorMessages() {
    this.errors = {};
    for (const message of OfferFormErrorMessages) {
      const control = this.offerForm.get(message.forControl);
      if (control &&
        control.dirty &&
        control.invalid &&
        control.errors &&
        control.errors[message.forValidator] &&
        !control.errors[message.forControl]
      ) {
        this.errors[message.forControl] = message.text;
      }
    }
    const appointmentsArray = this.offerForm.get('appointments') as FormArray;
    if (appointmentsArray && appointmentsArray.controls.length > 0) {
      appointmentsArray.controls.forEach((apptGroup, index) => {
        for (const message of OfferFormErrorMessages) {
          const control = apptGroup.get(message.forControl);
          if (
            control &&
            control.dirty &&
            control.invalid &&
            control.errors &&
            control.errors[message.forValidator] &&
            !control.errors[message.forControl]
          ) {
            //funkt wie ein Schlüssel: appointments[0].comment
            this.errors[`appointments[${index}].${message.forControl}`] = message.text;
          }
        }
      });
    }
  }

  submitForm() {
    const offerData = this.offerForm.value;
    const currentUserId = this.authService.getCurrentUserId();

    const appointmentsWithDateTime: Appointment[] = [];
    for (let i = 0; i < offerData.appointments.length; i++) {
      const appt = offerData.appointments[i];
      const scheduled_at = formatDateTimeForBackend(new Date(`${appt.date}T${appt.time}`));
      const newAppointment: Appointment = {
        id: appt.id ?? null,
        scheduled_at,
        status: appt.status,
        comment: appt.comment,
        offer_id: this.offer.id,
        user_id: null
      };

      appointmentsWithDateTime.push(newAppointment);
    }

    const offerToSave = {
      ...offerData,
      appointments: appointmentsWithDateTime,
      user_id: currentUserId
    };

    const offer: Offer = OfferFactory.fromObject(offerToSave);

    if (this.isUpdatingOffer) {
      // Hier deine Update-Logik
      this.ts.update(offer).subscribe(() => {
        const appointmentCalls: Observable<Appointment>[] = [];

        for (let appt of appointmentsWithDateTime) {

          if (appt.id) {
            appointmentCalls.push(this.ts.updateAppointment(appt.id, appt));
          } else {
            appointmentCalls.push(this.ts.createAppointment({ ...appt, offer_id: offer.id }));
          }
        }

        forkJoin(appointmentCalls).subscribe({
          next: () => {
            this.ts.getSubjectById(offer.subject_id).subscribe(subject => {
              offer.subject = subject;
              this.router.navigate(['/offers', offer.id]);
            });
          },
          error: err => {
            console.error('Fehler beim Aktualisieren der Termine:', err);
            this.router.navigate(['/offers', offer.id]);
          }
        });
      });

    } else {
      offer.user_id = currentUserId;

      this.ts.create(offer).subscribe({
        next: (createdOffer) => {
          const appointmentCalls: Observable<Appointment>[] = [];

          for (let appt of appointmentsWithDateTime) {
            const newAppt = { ...appt, offer_id: createdOffer.id };
            appointmentCalls.push(this.ts.createAppointment(newAppt));
          }

          forkJoin(appointmentCalls).subscribe({
            next: () => {
              this.router.navigate(['/offers']);
            },
            error: err => {
              console.error('Fehler beim Erstellen der Termine:', err);
              this.router.navigate(['/offers']);
            }
          });
        },
        error: err => {
          console.error('Fehler beim Erstellen des Angebots:', err);
        }
      });
    }
  }

}

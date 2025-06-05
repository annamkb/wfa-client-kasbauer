import {Component, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TeacherListComponent} from '../teacher-list/teacher-list.component';
import {SubjectListComponent} from '../subject-list/subject-list.component';
import {OfferListComponent} from '../offer-list/offer-list.component';
import {AppointmentListComponent} from '../appointment-list/appointment-list.component';
import {FilteredAppointmentListComponent} from '../filtered-appointment-list/filtered-appointment-list.component';
import {AuthenticationService} from '../shared/authentication.service';

@Component({
  selector: 'bs-home',
  imports: [
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  constructor() {}
}

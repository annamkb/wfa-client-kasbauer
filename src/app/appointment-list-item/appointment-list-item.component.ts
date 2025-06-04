import {Component, input} from '@angular/core';
import {Appointment} from '../shared/appointment';

@Component({
  selector: 'a.bs-appointment-list-item',
  imports: [],
  templateUrl: './appointment-list-item.component.html',
  styles: ``
})
export class AppointmentListItemComponent {
  appointment = input.required<Appointment>();
}

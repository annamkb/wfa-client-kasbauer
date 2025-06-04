import {Component, input} from '@angular/core';
import {Subject} from '../shared/offer';

@Component({
  selector: 'a.bs-subject-list-item',
  imports: [],
  templateUrl: './subject-list-item.component.html',
  styles: ``
})
export class SubjectListItemComponent {
  subject = input.required<Subject>();
  compact = input(false);
  overview = input(false);
}

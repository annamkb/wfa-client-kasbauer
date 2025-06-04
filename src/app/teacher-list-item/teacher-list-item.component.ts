import {Component, input} from '@angular/core';
import {User} from '../shared/user';

@Component({
  selector: 'a.bs-teacher-list-item',
  imports: [],
  templateUrl: './teacher-list-item.component.html',
  styles: ``
})
export class TeacherListItemComponent {
  teacher = input.required<User>();

}

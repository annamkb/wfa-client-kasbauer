import { Component } from '@angular/core';
import {TeacherContainerComponent} from "../teacher-container/teacher-container.component";
import {TeacherListItemComponent} from "../teacher-list-item/teacher-list-item.component";
import {httpResource} from '@angular/common/http';
import {User} from '../shared/user';
import {RouterLink} from '@angular/router';
import {environment} from '../../environments/environment';

@Component({
  selector: 'bs-teacher-list',
  imports: [
    TeacherContainerComponent,
    TeacherListItemComponent,
    RouterLink
  ],
  templateUrl: './teacher-list.component.html',
  styles: ``
})
export class TeacherListComponent {
  teachers = httpResource<User[]>(
    () =>`${environment.apiUrl}/users/teachers`
  )
}

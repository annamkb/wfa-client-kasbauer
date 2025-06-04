import {Component, Input} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {Subject} from '../shared/offer';
import {SubjectContainerComponent} from '../subject-container/subject-container.component';
import {SubjectListItemComponent} from '../subject-list-item/subject-list-item.component';
import {RouterLink} from '@angular/router';
import {environment} from '../../environments/environment';

@Component({
  selector: 'bs-subject-list',
  imports: [
    SubjectContainerComponent,
    SubjectListItemComponent,
    RouterLink
  ],
  templateUrl: './subject-list.component.html',
  styles: ``
})
export class SubjectListComponent {
  @Input() compact = false;
  @Input() overview = false;


  subjects = httpResource<Subject[]>(
    () =>`${environment.apiUrl}/subjects`
  )
}

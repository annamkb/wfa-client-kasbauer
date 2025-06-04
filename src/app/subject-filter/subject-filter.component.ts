import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { TutoringService } from '../shared/tutoring.service';
import { Subject } from '../shared/offer';

@Component({
  selector: 'bs-subject-filter',
  templateUrl: './subject-filter.component.html',
})

export class SubjectFilterComponent implements OnInit {
  subjects = signal<Subject[]>([]);
  @Output() subjectSelected = new EventEmitter<number | null>();

  constructor(private tutoringService: TutoringService) {}

  ngOnInit(): void {
    this.tutoringService.getSubjects().subscribe({
      next: subjects => this.subjects.set(subjects),
      error: () => this.subjects.set([]),
    });
  }

  onChange(value: string): void {
    const subjectId = value ? parseInt(value, 10) : null;
    this.subjectSelected.emit(subjectId);
  }


}

import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';

@Component({
  selector: 'bs-appointment-status-filter',
  templateUrl: './appointment-status-filter.component.html',
})

export class AppointmentStatusFilterComponent implements OnInit {
  statuses = signal<string[]>(['offered', 'accepted', 'rejected']);

  @Output() statusSelected = new EventEmitter<string | null>();

  constructor() {}

  ngOnInit(): void {
    // aktuell nichts weiter nötig
  }

  onChange(value: string): void {
    const status = value ? value : null;
    this.statusSelected.emit(status);
  }
}

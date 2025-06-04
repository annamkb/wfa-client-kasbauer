import {map, Observable} from 'rxjs';
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {TutoringService} from './tutoring.service';

export class OfferValidators {

  static futureOrTodayDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const today = new Date();

    // Heute mit Uhrzeit 0:00:00
    today.setHours(0,0,0,0);
    inputDate.setHours(0,0,0,0);
    return inputDate < today ? { futureOrTodayDate: true } : null;
  }

  static futureOrNowTime(dateControlName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null; // kein Wert => kein Fehler

      const timeParts = control.value.split(':');
      if (timeParts.length !== 2) return { futureOrNowTime: true };

      const hours = Number(timeParts[0]);
      const minutes = Number(timeParts[1]);

      const parent = control.parent;
      if (!parent) return null;

      const dateControl = parent.get(dateControlName);
      if (!dateControl || !dateControl.value) return null;

      const inputDate = new Date(dateControl.value);
      const now = new Date();

      if (!inputDate) return null;

      // Nur prüfen, wenn Datum heute ist
      const today = new Date();
      today.setHours(0,0,0,0);
      inputDate.setHours(0,0,0,0);

      if (inputDate.getTime() !== today.getTime()) {
        // Datum nicht heute, Zeit ist ok
        return null;
      }

      // Jetzt aktuelle Zeit in Minuten
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const inputMinutes = hours * 60 + minutes;

      return inputMinutes < nowMinutes ? { futureOrNowTime: true } : null;
    };
  }



  static subjectSelected(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { subject: 'Bitte ein Fach auswählen' } : null;
  }
}

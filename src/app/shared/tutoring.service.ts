import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";
import {Offer, Subject, User} from './offer';
import {Appointment} from './appointment';
import {environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TutoringService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Array<Offer>> {
    return this.http.get<Array<Offer>>(`${this.api}/offers`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  getSingle(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.api}/offers/${id}`).
    pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.api}/subjects`)
      .pipe(retry(3), catchError(this.errorHandler));
  }


  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }

  // needed for formular
  create(offer: Offer): Observable<any> {
    return this.http.post(`${this.api}/offers`, offer)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  update(offer: Offer): Observable<any> {
    return this.http.put(`${this.api}/offers/${offer.id}`, offer)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAppointmentsForOffer(offerId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.api}/offers/${offerId}/appointments`)
      .pipe(retry(3))
      .pipe(catchError(this.errorHandler));
  }

  getFilteredAppointmentsForStudentByOffer(offerId: number, status?: string): Observable<Appointment[]> {
    let url = `${this.api}/offers/${offerId}/appointments/filtered/students`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<Appointment[]>(url).pipe(
      retry(3),
      catchError(this.errorHandler)
    );
  }

  getAppointments(status?: string): Observable<Appointment[]> {
    let url = `${this.api}/appointments`;
    if (status) {
      url += `/status/${status}`;
    }
    return this.http.get<Appointment[]>(url).pipe(retry(3), catchError(this.errorHandler));
  }

  remove(id: string): Observable<Offer> {
    return this.http.delete<any>(`${this.api}/offers/${id}`).
    pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/users/${id}`)
      .pipe(retry(3), catchError(this.errorHandler));
  }

  getAppointmentsForStudent(studentId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.api}/students/${studentId}/appointments`)
      .pipe(retry(3), catchError(this.errorHandler));
  }
  getAcceptedAppointmentsForStudent(studentId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.api}/students/${studentId}/appointments/accepted`)
      .pipe(retry(3), catchError(this.errorHandler));
  }


  getAppointmentsForTeacher(teacherId: number, status?: string): Observable<Appointment[]> {
    let url = `${this.api}/teachers/${teacherId}/appointments`;
    if (status) {
      url += `/${status}`;
    }
    return this.http.get<Appointment[]>(url).pipe(
      retry(3),
      catchError(this.errorHandler)
    );
  }


  createOffer(offer: Offer): Observable<Offer> {
    return this.http.post<Offer>(`${this.api}/offers`, offer)
      .pipe(
        retry(3),
        catchError(this.errorHandler)
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/users`)
      .pipe(catchError(this.errorHandler));
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.api}/users`, user)
      .pipe(catchError(this.errorHandler));
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.api}/users/${id}`, user)
      .pipe(catchError(this.errorHandler));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.api}/users/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.api}/appointments`, appointment)
      .pipe(catchError(this.errorHandler));
  }

  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.api}/appointments/${id}`, appointment)
      .pipe(catchError(this.errorHandler));
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.api}/appointments/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  getTeachers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/users/teachers`)
      .pipe(catchError(this.errorHandler));
  }

  getStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/users/students`)
      .pipe(catchError(this.errorHandler));
  }

  createSubject(subject: Subject): Observable<Subject> {
    return this.http.post<Subject>(`${this.api}/subjects`, subject)
      .pipe(catchError(this.errorHandler));
  }

  getSubjectById(id: number): Observable<Subject> {
    return this.http.get<Subject>(`${this.api}/subjects/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  updateSubject(id: number, subject: Subject): Observable<Subject> {
    return this.http.put<Subject>(`${this.api}/subjects/${id}`, subject)
      .pipe(catchError(this.errorHandler));
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete(`${this.api}/subjects/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  getStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.api}/appointmentsstatus`)
      .pipe(
        retry(3),
        catchError(this.errorHandler)
      );
  }

  getOffersByTeacher(teacherId: number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.api}/teachers/${teacherId}/offers`)
      .pipe(
        retry(3),
        catchError(this.errorHandler)
      );
  }

  getOffersBySubject(subjectId: number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.api}/offers/subject/${subjectId}`)
      .pipe(
        retry(3),
        catchError(this.errorHandler)
      );
  }

  getFilteredAppointmentsForStudent(status?: string): Observable<Appointment[]> {
    let url = `${this.api}/appointments/filtered/students`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<Appointment[]>(url)
      .pipe(retry(3), catchError(this.errorHandler));
  }
  updateAppointmentStatus(id: number, status: string, comment?: string): Observable<Appointment> {
    const body: any = { status };

    if (status === 'rejected') {
      body.comment = comment ?? '';
    } else if (comment) {
      body.comment = comment;
    }

    return this.http.patch<Appointment>(`${this.api}/appointments/${id}/status`, body)
      .pipe(
        catchError(this.errorHandler)
      );
  }

    getAppointmentsHistory(userId: number): Observable<{ upcoming: Appointment[], past: Appointment[] }> {
      return this.http.get<{ upcoming: Appointment[], past: Appointment[] }>(`${this.api}/users/${userId}/appointments/history`)
        .pipe(
          retry(3),
          catchError(this.errorHandler)
        );
    }


}

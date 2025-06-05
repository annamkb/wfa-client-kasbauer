import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {OfferListComponent} from './offer-list/offer-list.component';
import {SubjectListComponent} from './subject-list/subject-list.component';
import {TeacherListComponent} from './teacher-list/teacher-list.component';
import {AppointmentListComponent} from './appointment-list/appointment-list.component';
import {OfferDetailComponent} from './offer-detail/offer-detail.component';
import {OfferFormComponent} from './offer-form/offer-form.component';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profil/profil.component';


export const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'home', component: HomeComponent},
  {path:'offers', component: OfferListComponent},
  {path:'offers/:id', component: OfferDetailComponent}, // :id is dynamic route parameter
  {path:'subjects', component: SubjectListComponent},
  {path:'teachers', component: TeacherListComponent},
  {path:'appointments', component: AppointmentListComponent},
  {path: 'admin', component: OfferFormComponent },
  {path: 'admin/:id', component: OfferFormComponent },
  {path: 'login', component: LoginComponent },
  {path: 'profil', component: ProfileComponent },
];

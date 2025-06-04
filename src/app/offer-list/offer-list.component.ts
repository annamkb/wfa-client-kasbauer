import { Component, OnInit, signal } from '@angular/core';
import { OfferContainerComponent } from '../offer-container/offer-container.component';
import { OfferListItemComponent } from '../offer-list-item/offer-list-item.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TutoringService } from '../shared/tutoring.service';
import { Offer, User } from '../shared/offer';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../shared/authentication.service';
import {environment} from '../../environments/environment';
import {SubjectFilterComponent} from '../subject-filter/subject-filter.component';

@Component({
  selector: 'bs-offer-list',
  imports: [
    OfferContainerComponent,
    OfferListItemComponent,
    RouterLink,
    SubjectFilterComponent,
  ],
  providers: [{ provide: TutoringService, useClass: TutoringService }],
  templateUrl: './offer-list.component.html',
  styles: ``
})
export class OfferListComponent implements OnInit {
  showOwnOffers = signal(true);
  offers = signal<Offer[] | null>(null);
  error = signal<string | null>(null);
  loading = signal(false);

  isLoggedIn = signal(false);
  userRole = signal('');
  userId: number | null = null;
  currentUser = signal<User | null>(null);
  selectedSubjectId = signal<number | null>(null);

  constructor(
    private http: HttpClient,
    protected as: AuthenticationService,
    protected ts: TutoringService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.isLoggedIn.set(this.as.isLoggedIn());
    this.userRole.set(this.as.getCurrentUserRole());

    const partialUser = this.as.getCurrentUser();
    if (partialUser && partialUser.id) {
      this.userId = partialUser.id;
      this.loadUser(this.userId);
    }

    this.route.queryParams.subscribe(params => {
      const ownParam = params['own'];
      this.showOwnOffers.set(ownParam === 'true');
      this.loadOffers();
    });

    this.loadOffers();
  }

  loadUser(id: number) {
    this.ts.getUserById(id).subscribe({
      next: (user: User) => {
        this.currentUser.set(user);
      },
      error: () => {
        this.currentUser.set(null);
      }
    });
  }


  toggleShowOwnOffers() {
    this.showOwnOffers.update(value => !value);
    this.loadOffers();
  }

  loadOffers() {
    this.loading.set(true);
    this.error.set(null);

    const subjectId = this.selectedSubjectId();

    const offerCallback = (offers: Offer[]) => {
      const filteredOffers = subjectId
        ? offers.filter(o => o.subject?.id === subjectId)
        : offers;
      this.offers.set(filteredOffers);
      this.loading.set(false);
    };

    const errorCallback = () => {
      this.error.set('Fehler beim Laden der Angebote.');
      this.loading.set(false);
    };

    if (this.showOwnOffers() && this.userId !== null) {
      this.ts.getOffersByTeacher(this.userId).subscribe({
        next: offerCallback,
        error: errorCallback,
      });
    } else {
      this.ts.getAll().subscribe({
        next: offerCallback,
        error: errorCallback,
      });
    }
  }


  onSubjectSelected(subjectId: number | null): void {
    this.selectedSubjectId.set(subjectId);
    this.loadOffers();
  }

}

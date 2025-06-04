import {Component, input} from '@angular/core';
import {Offer} from '../shared/offer';

@Component({
  selector: 'a.bs-offer-list-item',
  imports: [],
  templateUrl: './offer-list-item.component.html',
  styles: ``
})
export class OfferListItemComponent {
  offer = input.required<Offer>();
}


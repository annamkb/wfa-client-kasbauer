import { Offer } from './offer';
import { User } from './user';
import { Subject } from './subject';
import { Appointment } from './appointment';

export class OfferFactory {
  static empty(): Offer {
    return new Offer(0, 0, 0, '', undefined, undefined, []);
  }

  static fromObject(rawOffer: any): Offer {
    return new Offer(
      rawOffer.id,
      rawOffer.user_id,
      rawOffer.subject_id,
      rawOffer.description,
      rawOffer.user ? rawOffer.user : undefined,
      rawOffer.subject ? rawOffer.subject : undefined,
      rawOffer.appointments ? rawOffer.appointments : []
    );
  }
}

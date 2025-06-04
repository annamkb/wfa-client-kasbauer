import { User } from './user';
import { Offer } from './offer';
export { User } from './user';
export { Offer } from './offer';

export class Appointment {
  constructor(
    public id: number,
    public offer_id: number,
    public user_id: number | null,
    public scheduled_at: string, 
    public status: 'offered' | 'accepted' | 'rejected',
    public comment?: string,
    public offer?: Offer,
    public user?: User
  ) {}
}

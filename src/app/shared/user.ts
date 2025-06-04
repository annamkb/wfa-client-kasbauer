import {Offer} from './offer';
import {Appointment} from './appointment';
export {Offer} from './offer';
// export {Appointment} from './appointment';

export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public role: string,
    public education?: string,
    public contact?: string,
    public offers?: Offer[],
    public appointments?: Appointment[]
  ) {}
}

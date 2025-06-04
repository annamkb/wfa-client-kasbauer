import { Offer } from './offer';
export { Offer } from './offer';

export class Subject {
  constructor(
    public id: number,
    public name: string,
    public description?: string,
    public offers?: Offer[]
  ) {}
}

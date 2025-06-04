import { User } from './user';
import { Subject } from './subject';
import { Appointment } from './appointment';
export { User } from './user';
export { Subject } from './subject';
// export { Appointment } from './appointment';

export class Offer {
  constructor(
    public id: number,
    public user_id: number,
    public subject_id: number,
    public description: string,
    public user?: User,
    public subject?: Subject,
    public appointments?: Appointment[]
  ) {}
}

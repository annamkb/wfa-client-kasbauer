export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) { }
}
export const OfferFormErrorMessages = [
  new ErrorMessage('description', 'required', 'Ein Name muss angegeben werden'),
  new ErrorMessage('description', 'minlength', 'Der Name muss mindestens 5 Zeichen enthalten'),
  new ErrorMessage('description', 'maxlength', 'Der Name darf höchstens 50 Zeichen haben'),
  new ErrorMessage('subject_id', 'required', 'Bitte wähle ein Fach aus'),
  new ErrorMessage('date', 'required', 'Datum muss angegeben werden'),
  new ErrorMessage('date', 'futureOrTodayDate', 'Das Datum darf nicht in der Vergangenheit liegen'),
  new ErrorMessage('time', 'futureOrNowTime', 'Die Uhrzeit darf nicht in der Vergangenheit liegen'),
  new ErrorMessage('time', 'required', 'Uhrzeit muss angegeben werden'),
  new ErrorMessage('scheduled_at', 'required', 'Datum & Uhrzeit müssen angegeben werden'),
  new ErrorMessage('scheduled_at', 'futureDate', 'Datum & Uhrzeit müssen in der Zukunft liegen'),
  new ErrorMessage('status', 'required', 'Status ist erforderlich'),
  new ErrorMessage('comment', 'maxlength', 'Kommentar darf höchstens 200 Zeichen haben'),
];

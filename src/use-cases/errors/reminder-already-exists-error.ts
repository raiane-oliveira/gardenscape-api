export class ReminderAlreadyExistsError extends Error {
  constructor() {
    super('A reminder for this date already exists')
  }
}

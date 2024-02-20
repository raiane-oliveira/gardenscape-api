export class PlantAlreadyExistsError extends Error {
  constructor() {
    super('This plant already exists')
  }
}

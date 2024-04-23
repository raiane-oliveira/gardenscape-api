import { UseCaseError } from "./use-case-error"

export class PlantAlreadyExistsOnGarden extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Plant already exists on garden "${identifier}"`)
  }
}

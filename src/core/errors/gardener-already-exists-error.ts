import { UseCaseError } from "./use-case-error"

export class GardenerAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Gardener "${identifier}" already exists.`)
  }
}

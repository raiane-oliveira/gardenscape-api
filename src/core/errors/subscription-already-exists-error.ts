import { UseCaseError } from "./use-case-error"

export class SubscriptionAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Subscription "${identifier}" already exists.`)
  }
}

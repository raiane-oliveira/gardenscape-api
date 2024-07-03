import { Subscription } from "../entities/subscription"

export abstract class SubscriptionsRepository {
  abstract create(subscription: Subscription): Promise<void>
  abstract findById(subscriptionId: string): Promise<Subscription | null>
}

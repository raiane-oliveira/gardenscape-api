import { Subscription } from "@/domain/billing/entities/subscription"
import { SubscriptionsRepository } from "@/domain/billing/repositories/subscriptions-repository"

export class InMemorySubscriptionsRepository
  implements SubscriptionsRepository
{
  items: Subscription[] = []

  async create(subscription: Subscription) {
    this.items.push(subscription)
  }

  async findById(subscriptionId: string) {
    const subscription = this.items.find(
      (item) => item.id.toString() === subscriptionId,
    )

    if (!subscription) return null

    return subscription
  }
}

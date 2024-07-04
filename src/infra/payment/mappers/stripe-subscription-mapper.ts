import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Subscription } from "@/domain/billing/entities/subscription"
import Stripe from "stripe"

export class StripeSubscriptionMapper {
  static toDomain(raw: Stripe.Subscription): Subscription {
    return Subscription.create(
      {
        userId: new UniqueEntityId(raw.metadata.userId),
        productId: new UniqueEntityId(raw.items.data[0].price.id.toString()),
        active: raw.status === "active",
        customerId: raw.customer.toString(),
        createdAt: new Date(raw.created),
        updatedAt: null,
      },
      new UniqueEntityId(raw.id),
    )
  }
}

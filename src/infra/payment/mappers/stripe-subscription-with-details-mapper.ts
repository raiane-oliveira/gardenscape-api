import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { SubscriptionWithDetails } from "@/domain/billing/entities/value-objects/subscription-with-details"
import Stripe from "stripe"

interface StripeSubscriptionWithDetailsType extends Stripe.Subscription {
  product: Stripe.Product
}

export class StripeSubscriptionWithDetailsMapper {
  static toDomain(
    raw: StripeSubscriptionWithDetailsType,
  ): SubscriptionWithDetails {
    const product = raw.product

    return SubscriptionWithDetails.create({
      subscriptionId: raw.id,
      userId: new UniqueEntityId(raw.metadata.userId),
      active: raw.status === "active",
      customerId: raw.customer.toString(),
      product: {
        id: new UniqueEntityId(product.id),
        name: product.name,
        description: product.description,
        imageUrl: product.images[0],
        price: (raw.items.data[0].price.unit_amount as number) / 100,
        features: product.marketing_features.map((feature) => {
          return {
            id: new UniqueEntityId(),
            name: feature.name ?? "",
          }
        }),
      },
      subscribeAt: new Date(raw.created),
      updatedAt: null,
    })
  }
}

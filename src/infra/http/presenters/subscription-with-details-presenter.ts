import { SubscriptionWithDetails } from "@/domain/billing/entities/value-objects/subscription-with-details"

export class SubscriptionWithDetailsPresenter {
  static toHttp(value: SubscriptionWithDetails) {
    return {
      id: value.subscriptionId,
      userId: value.userId.toString(),
      active: value.active,
      subscribeAt: value.subscribeAt,
      product: {
        id: value.product.id.toString(),
        name: value.product.name,
        description: value.product.description,
        imageUrl: value.product.imageUrl,
        price: value.product.price,
        features: value.product.features.map((feature) => {
          return {
            id: feature.id.toString(),
            name: feature.name,
            description: feature.description,
          }
        }),
      },
    }
  }
}

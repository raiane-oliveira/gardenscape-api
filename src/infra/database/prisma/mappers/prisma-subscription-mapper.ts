import { Prisma, Subscription as PrismaSubscription } from "@prisma/client"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Subscription } from "@/domain/billing/entities/subscription"

export class PrismaSubscriptionMapper {
  static toDomain(raw: PrismaSubscription): Subscription {
    return Subscription.create(
      {
        userId: new UniqueEntityId(raw.userId),
        productId: new UniqueEntityId(raw.productId),
        customerId: raw.customerId,
        active: raw.active,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    subscription: Subscription,
  ): Prisma.SubscriptionUncheckedCreateInput {
    return {
      subscriptionId: subscription.id.toString(),
      productId: subscription.productId.toString(),
      customerId: subscription.customerId.toString(),
      userId: subscription.userId.toString(),
      active: subscription.active,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    }
  }
}

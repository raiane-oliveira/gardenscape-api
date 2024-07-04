import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import {
  Subscription,
  SubscriptionProps,
} from "@/domain/billing/entities/subscription"
import { PrismaSubscriptionMapper } from "@/infra/database/prisma/mappers/prisma-subscription-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makeSubscription(
  override?: Partial<SubscriptionProps>,
  id?: UniqueEntityId,
) {
  const subscription = Subscription.create(
    {
      userId: new UniqueEntityId(faker.string.uuid()),
      productId: new UniqueEntityId(faker.string.uuid()),
      customerId: faker.string.uuid(),
      active: true,
      ...override,
    },
    id,
  )

  return subscription
}

@Injectable()
export class SubscriptionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSubscription(
    override?: Partial<SubscriptionProps>,
    id?: UniqueEntityId,
  ): Promise<Subscription> {
    const subscription = makeSubscription(override, id)

    await this.prisma.subscription.create({
      data: PrismaSubscriptionMapper.toPrisma(subscription),
    })

    return subscription
  }
}

import { SubscriptionsRepository } from "@/domain/billing/repositories/subscriptions-repository"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { Subscription } from "@/domain/billing/entities/subscription"
import { PrismaSubscriptionMapper } from "../mappers/prisma-subscription-mapper"

@Injectable()
export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(subscription: Subscription) {
    const data = PrismaSubscriptionMapper.toPrisma(subscription)

    await this.prisma.subscription.create({
      data,
    })
  }

  async findById(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        subscriptionId,
      },
    })

    if (!subscription) return null

    return PrismaSubscriptionMapper.toDomain(subscription)
  }
}

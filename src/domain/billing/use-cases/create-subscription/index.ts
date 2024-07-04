import { Injectable } from "@nestjs/common"
import { SubscriptionsRepository } from "../../repositories/subscriptions-repository"
import { Subscription } from "../../entities/subscription"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Either, left, right } from "@/core/either"
import { SubscriptionAlreadyExistsError } from "@/core/errors/subscription-already-exists-error"

interface CreateSubscriptionUseCaseRequest {
  subscriptionId?: string
  productId: string
  customerId: string
  userId: string
  active: boolean
}

type CreateSubscriptionUseCaseResponse = Either<
  SubscriptionAlreadyExistsError,
  {
    subscription: Subscription
  }
>

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(private subscriptionsRepository: SubscriptionsRepository) {}

  async execute({
    subscriptionId,
    productId,
    userId,
    active,
    customerId,
  }: CreateSubscriptionUseCaseRequest): Promise<CreateSubscriptionUseCaseResponse> {
    const subscription = Subscription.create(
      {
        productId: new UniqueEntityId(productId),
        userId: new UniqueEntityId(userId),
        customerId,
        active,
      },
      subscriptionId ? new UniqueEntityId(subscriptionId) : undefined,
    )

    const subscriptionAlreadyExists =
      await this.subscriptionsRepository.findById(subscription.id.toString())

    if (subscriptionAlreadyExists) {
      return left(
        new SubscriptionAlreadyExistsError(subscription.id.toString()),
      )
    }

    await this.subscriptionsRepository.create(subscription)

    return right({
      subscription,
    })
  }
}

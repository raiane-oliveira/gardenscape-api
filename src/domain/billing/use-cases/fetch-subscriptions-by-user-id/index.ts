import { Injectable } from "@nestjs/common"
import { PaymentGateway } from "../../payment/gateway"
import { Either, right } from "@/core/either"
import { SubscriptionsRepository } from "../../repositories/subscriptions-repository"
import { SubscriptionWithDetails } from "../../entities/value-objects/subscription-with-details"

interface FetchSubscriptionsByUserIdRequest {
  userId: string
}

type FetchSubscriptionsByUserIdResponse = Either<
  null,
  {
    subscriptions: SubscriptionWithDetails[]
  }
>

@Injectable()
export class FetchSubscriptionsByUserIdUseCase {
  constructor(
    private paymentGateway: PaymentGateway,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    userId,
  }: FetchSubscriptionsByUserIdRequest): Promise<FetchSubscriptionsByUserIdResponse> {
    const userSubscription =
      await this.subscriptionsRepository.findManyByUserId(userId)

    const customerId = userSubscription[0].customerId

    const subscriptions =
      await this.paymentGateway.findSubscriptionsByCustomerId(customerId)

    return right({
      subscriptions,
    })
  }
}

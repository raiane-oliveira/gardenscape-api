import { FetchSubscriptionsByUserIdUseCase } from "@/domain/billing/use-cases/fetch-subscriptions-by-user-id"
import { BadRequestException, Controller, Get, Param } from "@nestjs/common"
import { SubscriptionWithDetailsPresenter } from "../presenters/subscription-with-details-presenter"

@Controller()
export class FetchSubscriptionsController {
  constructor(
    private fetchSubscriptionsUseCase: FetchSubscriptionsByUserIdUseCase,
  ) {}

  @Get("/subscriptions/:userId")
  async handle(@Param("userId") userId: string) {
    const result = await this.fetchSubscriptionsUseCase.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      subscriptions: result.value.subscriptions.map(
        SubscriptionWithDetailsPresenter.toHttp,
      ),
    }
  }
}

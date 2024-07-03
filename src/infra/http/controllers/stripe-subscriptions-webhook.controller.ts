import { CreateSubscriptionUseCase } from "@/domain/billing/use-cases/create-subscription"
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from "@nestjs/common"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { z } from "zod"
import Stripe from "stripe"
import { SubscriptionAlreadyExistsError } from "@/core/errors/subscription-already-exists-error"
import { Public } from "@/infra/auth/public"

const subscriptionsWebhookBodySchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
})

type SubscriptionsWebhookBodyData = z.infer<
  typeof subscriptionsWebhookBodySchema
>

@Controller()
export class StripeSubscriptionsWebhookController {
  constructor(private createSubscriptionUseCase: CreateSubscriptionUseCase) {}

  @Post("/webhook/payment/subscriptions")
  @Public()
  @UsePipes(new ZodValidationPipe(subscriptionsWebhookBodySchema))
  async handle(@Body() event: SubscriptionsWebhookBodyData) {
    switch (event.type) {
      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription

        const result = await this.createSubscriptionUseCase.execute({
          subscriptionId: subscription.id,
          productId: subscription.items.data[0].price.id,
          active: subscription.status === "active",
          userId: subscription.customer.toString(),
        })

        if (result.isLeft()) {
          const error = result.value

          switch (error.constructor) {
            case SubscriptionAlreadyExistsError:
              throw new ConflictException(error.message)
            default:
              throw new BadRequestException(error.message)
          }
        }

        break
    }
  }
}

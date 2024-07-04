import { CreateCheckoutUseCase } from "@/domain/billing/use-cases/create-checkout"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common"

@Controller()
export class CreateCheckoutPaymentController {
  constructor(private createCheckoutUseCase: CreateCheckoutUseCase) {}

  @HttpCode(201)
  @Post("/products/:productId/checkout")
  async handle(
    @Param("productId") productId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.createCheckoutUseCase.execute({
      productId,
      userId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      checkoutUrl: result.value.checkout.url,
    }
  }
}

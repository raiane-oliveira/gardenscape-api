import { CreateCheckoutUseCase } from "@/domain/billing/use-cases/create-checkout"
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
  async handle(@Param("productId") productId: string) {
    const result = await this.createCheckoutUseCase.execute({
      productId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      checkoutUrl: result.value.checkout.url,
    }
  }
}

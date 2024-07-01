import { Injectable } from "@nestjs/common"
import { PaymentGateway } from "../../payment/gateway"
import { Either, right } from "@/core/either"
import { Checkout } from "../../entities/checkout"

interface CreateCheckoutUseCaseRequest {
  productId: string
}

type CreateCheckoutUseCaseResponse = Either<
  null,
  {
    checkout: Checkout
  }
>

@Injectable()
export class CreateCheckoutUseCase {
  constructor(private paymentGateway: PaymentGateway) {}

  async execute({
    productId,
  }: CreateCheckoutUseCaseRequest): Promise<CreateCheckoutUseCaseResponse> {
    const checkout = await this.paymentGateway.createCheckout(productId)

    return right({
      checkout,
    })
  }
}

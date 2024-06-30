import { Injectable } from "@nestjs/common"
import { PaymentGateway } from "../../payment/gateway"
import { Either, right } from "@/core/either"
import { ProductWithFeatures } from "../../entities/value-objects/product-with-features"

type FetchProductsUseCaseResponse = Either<
  null,
  {
    products: ProductWithFeatures[]
  }
>

@Injectable()
export class FetchProductsUseCase {
  constructor(private paymentGateway: PaymentGateway) {}

  async execute(): Promise<FetchProductsUseCaseResponse> {
    const products = await this.paymentGateway.fetchProductsWithFeatures()

    return right({
      products,
    })
  }
}

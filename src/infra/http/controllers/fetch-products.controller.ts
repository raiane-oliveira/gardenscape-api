import { FetchProductsUseCase } from "@/domain/billing/use-cases/fetch-products"
import { BadRequestException, Controller, Get } from "@nestjs/common"
import { ProductWithFeaturesPresenter } from "../presenters/product-with-features-presenter"

@Controller()
export class FetchProductsController {
  constructor(private fetchProductsUseCase: FetchProductsUseCase) {}

  @Get("/products")
  async handle() {
    const result = await this.fetchProductsUseCase.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      products: result.value.products.map(ProductWithFeaturesPresenter.toHttp),
    }
  }
}

import { Checkout } from "../entities/checkout"
import { Feature } from "../entities/feature"
import { Product } from "../entities/product"
import { ProductWithFeatures } from "../entities/value-objects/product-with-features"
import { SubscriptionWithDetails } from "../entities/value-objects/subscription-with-details"

interface CreateCheckoutArgs {
  productId: string
  userId: string
}

export abstract class PaymentGateway {
  abstract fetchProducts(): Promise<Product[]>
  abstract fetchFeaturesByProduct(productId: string): Promise<Feature[]>
  abstract fetchProductsWithFeatures(): Promise<ProductWithFeatures[]>
  abstract createCheckout(params: CreateCheckoutArgs): Promise<Checkout>
  abstract findSubscriptionsByCustomerId(
    customerId: string,
  ): Promise<SubscriptionWithDetails[]>
}

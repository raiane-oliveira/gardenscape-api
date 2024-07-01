import { Checkout } from "../entities/checkout"
import { Feature } from "../entities/feature"
import { Product } from "../entities/product"
import { ProductWithFeatures } from "../entities/value-objects/product-with-features"

export abstract class PaymentGateway {
  abstract fetchProducts(): Promise<Product[]>
  abstract fetchFeaturesByProduct(productId: string): Promise<Feature[]>
  abstract fetchProductsWithFeatures(): Promise<ProductWithFeatures[]>
  abstract createCheckout(productId: string): Promise<Checkout>
}

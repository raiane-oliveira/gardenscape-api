import { Product } from "@/domain/billing/entities/product"
import { PaymentGateway } from "@/domain/billing/payment/gateway"
import { makeProduct } from "../factories/make-product"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Feature } from "@/domain/billing/entities/feature"
import { ProductWithFeatures } from "@/domain/billing/entities/value-objects/product-with-features"

export class FakePaymentGateway implements PaymentGateway {
  items: Product[] = [
    makeProduct({}, new UniqueEntityId("product-01")),
    makeProduct({}, new UniqueEntityId("product-02")),
  ]

  async fetchProducts(): Promise<Product[]> {
    return this.items
  }

  async fetchFeaturesByProduct(productId: string): Promise<Feature[]> {
    return [
      Feature.create({
        name: "feature 01",
        description: "lorem",
        productId: new UniqueEntityId(productId),
      }),
      Feature.create({
        name: "feature 02",
        description: "lorem",
        productId: new UniqueEntityId(productId),
      }),
    ]
  }

  async fetchProductsWithFeatures(): Promise<ProductWithFeatures[]> {
    const feature1 = Feature.create({
      name: "feature 01",
      description: "lorem",
      productId: new UniqueEntityId("product-01"),
    })

    const feature2 = Feature.create({
      name: "feature 02",
      description: "lorem",
      productId: new UniqueEntityId("product-02"),
    })

    return this.items.map((product) => {
      return ProductWithFeatures.create({
        productId: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        createdAt: product.createdAt,
        features:
          product.id.toString() === "product-01" ? [feature1] : [feature2],
      })
    })
  }
}

import { ConfigService } from "@nestjs/config"
import Stripe from "stripe"
import { Env } from "../env"
import { PaymentGateway } from "@/domain/billing/payment/gateway"
import { Feature } from "@/domain/billing/entities/feature"
import { Product } from "@/domain/billing/entities/product"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Injectable } from "@nestjs/common"
import { ProductWithFeatures } from "@/domain/billing/entities/value-objects/product-with-features"

@Injectable()
export class StripePaymentGateway implements PaymentGateway {
  private gateway: Stripe

  constructor(envService: ConfigService<Env, true>) {
    this.gateway = new Stripe(envService.get("STRIPE_SECRET_KEY"), {
      appInfo: {
        name: "Gardenscape",
      },
    })
  }

  async fetchProducts() {
    const response = await this.gateway.products.list({
      expand: ["data.default_price"],
    })

    const products = response.data.map((product) => {
      const price = product.default_price as Stripe.Price

      return {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: (price.unit_amount as number) / 100,
        description: product.description,
        type: product.metadata.type,
      }
    })

    return products.map((product) => {
      return Product.create(
        {
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          status: product.type,
        },
        new UniqueEntityId(product.id),
      )
    })
  }

  async fetchFeaturesByProduct(productId: string): Promise<Feature[]> {
    console.log("product id", productId)
    throw new Error("Method not implemented.")
  }

  async fetchProductsWithFeatures(): Promise<ProductWithFeatures[]> {
    const response = await this.gateway.products.list({
      expand: ["data.default_price"],
    })

    const products = response.data.map((product) => {
      const price = product.default_price as Stripe.Price

      return {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: (price.unit_amount as number) / 100,
        description: product.description,
        type: product.metadata.type,
        features: product.marketing_features,
        createdAt: new Date(product.created),
      }
    })

    return products.map((product) => {
      return ProductWithFeatures.create({
        productId: new UniqueEntityId(product.id),
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        status: product.type,
        createdAt: product.createdAt,
        features: product.features.map((feature) => {
          return Feature.create({
            name: feature.name ?? "",
            productId: new UniqueEntityId(product.id),
          })
        }),
      })
    })
  }
}

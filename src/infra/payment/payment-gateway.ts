import { ConfigService } from "@nestjs/config"
import Stripe from "stripe"
import { Env } from "../env"
import { PaymentGateway } from "@/domain/billing/payment/gateway"
import { Feature } from "@/domain/billing/entities/feature"
import { Product } from "@/domain/billing/entities/product"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Injectable } from "@nestjs/common"
import { ProductWithFeatures } from "@/domain/billing/entities/value-objects/product-with-features"
import { Checkout } from "@/domain/billing/entities/checkout"
import { StripeSubscriptionWithDetailsMapper } from "./mappers/stripe-subscription-with-details-mapper"

@Injectable()
export class StripePaymentGateway implements PaymentGateway {
  private gateway: Stripe

  constructor(private envService: ConfigService<Env, true>) {
    this.gateway = new Stripe(this.envService.get("STRIPE_SECRET_KEY"), {
      appInfo: {
        name: "Gardenscape",
      },
      // typescript: true,
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
      const price = product.default_price as Stripe.Price | null

      return ProductWithFeatures.create({
        productId: new UniqueEntityId(product.id),
        name: product.name,
        description: product.description,
        imageUrl: product.images[0],
        price: (price?.unit_amount as number) / 100 ?? 0,
        status: product.type,
        createdAt: new Date(product.created),
        features: product.marketing_features.map((feature) => {
          return Feature.create({
            name: feature.name ?? "",
            productId: new UniqueEntityId(product.id),
          })
        }),
      })
    })

    return products
  }

  async createCheckout({ productId, userId }) {
    const product = await this.gateway.products.retrieve(productId, {
      expand: ["default_price"],
    })

    const price = product.default_price as Stripe.Price

    const successUrl = `${this.envService.get("STRIPE_SUCCESS_CHECKOUT_URL")}?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = this.envService.get("STRIPE_CANCEL_CHECKOUT_URL")

    const checkoutSession = await this.gateway.checkout.sessions.create({
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: price.id,
          quantity: 1,
          // price_data: {
          //   currency: price.currency,
          // },
        },
      ],
      subscription_data: {
        metadata: {
          userId,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return Checkout.create({
      url: checkoutSession.url ?? "",
      userId,
    })
  }

  async findSubscriptionsByCustomerId(customerId: string) {
    const subscriptions = await this.gateway.subscriptions.list({
      customer: customerId,
    })

    if (subscriptions.data.length <= 0) {
      return []
    }

    const productId = subscriptions.data[0].items.data[0].plan.product ?? ""

    const product = await this.gateway.products.retrieve(productId.toString(), {
      expand: ["default_price"],
    })

    return subscriptions.data.map((subscription) => {
      return StripeSubscriptionWithDetailsMapper.toDomain({
        ...subscription,
        product,
      })
    })
  }
}

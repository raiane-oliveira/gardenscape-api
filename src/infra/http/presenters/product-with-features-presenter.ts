import { ProductWithFeatures } from "@/domain/billing/entities/value-objects/product-with-features"

export class ProductWithFeaturesPresenter {
  static toHttp(raw: ProductWithFeatures) {
    return {
      id: raw.productId.toString(),
      name: raw.name,
      description: raw.description,
      imageUrl: raw.imageUrl,
      price: raw.price,
      status: raw.status,
      features: raw.features.map((feature) => {
        return {
          id: feature.id.toString(),
          name: feature.name,
          description: feature.description,
          createdAt: feature.createdAt,
          updatedAt: feature.updatedAt,
        }
      }),
      createdAt: raw.createdAt,
    }
  }
}

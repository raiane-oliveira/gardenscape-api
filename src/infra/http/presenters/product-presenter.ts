import { Product } from "@/domain/billing/entities/product"

export class ProductPresenter {
  static toHttp(raw: Product) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      description: raw.description,
      imageUrl: raw.imageUrl,
      price: raw.price,
      status: raw.status,
      createdAt: raw.createdAt,
    }
  }
}

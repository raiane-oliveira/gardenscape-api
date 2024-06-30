import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { ValueObject } from "@/core/entities/value-object"

interface ProductWithFeaturesProps {
  productId: UniqueEntityId
  name: string
  description: string | null
  imageUrl?: string | null
  price: number
  status?: string
  features: {
    id: UniqueEntityId
    name: string
    description?: string | null
    createdAt: Date
    updatedAt?: Date | null
  }[]
  createdAt: Date
}

export class ProductWithFeatures extends ValueObject<ProductWithFeaturesProps> {
  get productId() {
    return this.props.productId
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get imageUrl() {
    return this.props.imageUrl
  }

  get price() {
    return this.props.price
  }

  get status() {
    return this.props.status
  }

  get features() {
    return this.props.features
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: ProductWithFeaturesProps) {
    const productWithFeature = new ProductWithFeatures(props)

    return productWithFeature
  }
}

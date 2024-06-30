import { Entity } from "@/core/entities/entity"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface ProductProps {
  name: string
  description: string | null
  price: number
  imageUrl?: string | null
  status?: string
  createdAt: Date
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get price() {
    return this.props.price
  }

  get imageUrl() {
    return this.props.imageUrl
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<ProductProps, "createdAt">,
    id?: UniqueEntityId,
  ) {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return product
  }
}

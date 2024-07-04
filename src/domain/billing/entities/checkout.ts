import { Entity } from "@/core/entities/entity"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface CheckoutProps {
  url: string
  userId: UniqueEntityId
  createdAt: Date
}

export class Checkout extends Entity<CheckoutProps> {
  get url() {
    return this.props.url
  }

  get createdAt() {
    return this.props.createdAt
  }

  get userId() {
    return this.props.userId
  }

  static create(
    props: Optional<CheckoutProps, "createdAt">,
    id?: UniqueEntityId,
  ) {
    const checkout = new Checkout(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return checkout
  }
}

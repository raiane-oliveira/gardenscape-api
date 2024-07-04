import { Entity } from "@/core/entities/entity"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface SubscriptionProps {
  productId: UniqueEntityId
  userId: UniqueEntityId
  customerId: string
  active: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export class Subscription extends Entity<SubscriptionProps> {
  get productId() {
    return this.props.productId
  }

  get userId() {
    return this.props.userId
  }

  get customerId() {
    return this.props.customerId
  }

  get active() {
    return this.props.active
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<SubscriptionProps, "createdAt">,
    id?: UniqueEntityId,
  ) {
    const subscription = new Subscription(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return subscription
  }
}

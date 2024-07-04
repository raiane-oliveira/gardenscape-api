import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { ValueObject } from "@/core/entities/value-object"

interface SubscriptionWithDetailsProps {
  subscriptionId: string
  active: boolean
  userId: UniqueEntityId
  customerId: string
  product: {
    id: UniqueEntityId
    name: string
    price: number
    description: string | null
    imageUrl?: string | null
    features: {
      id: UniqueEntityId
      name: string
      description?: string | null
    }[]
  }
  subscribeAt: Date
  updatedAt?: Date | null
}

export class SubscriptionWithDetails extends ValueObject<SubscriptionWithDetailsProps> {
  get subscriptionId() {
    return this.props.subscriptionId
  }

  get product() {
    return this.props.product
  }

  get active() {
    return this.props.active
  }

  get userId() {
    return this.props.userId
  }

  get customerId() {
    return this.props.customerId
  }

  get subscribeAt() {
    return this.props.subscribeAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: SubscriptionWithDetailsProps) {
    const subscriptionWithDetails = new SubscriptionWithDetails(props)

    return subscriptionWithDetails
  }
}

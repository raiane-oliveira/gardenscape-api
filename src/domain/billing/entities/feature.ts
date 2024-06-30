import { Entity } from "@/core/entities/entity"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface FeatureProps {
  name: string
  description?: string | null
  productId: UniqueEntityId
  updatedAt?: Date | null
  createdAt: Date
}

export class Feature extends Entity<FeatureProps> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get name() {
    return this.props.name
  }

  set name(value) {
    this.props.name = value
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(value) {
    this.props.description = value
    this.touch()
  }

  get productId() {
    return this.props.productId
  }

  set productId(value) {
    this.props.productId = value
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<FeatureProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityId,
  ) {
    const feature = new Feature(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return feature
  }
}

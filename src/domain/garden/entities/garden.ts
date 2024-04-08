import { Entity } from "@/core/entities/entity"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { Slug } from "./value-objects/slug"

export type GardenVisibility = "public" | "private"

export interface GardenProps {
  name: string
  slug: Slug
  visibility: GardenVisibility
  gardenerId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date | null
}

export class Garden extends Entity<GardenProps> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get visibility() {
    return this.props.visibility
  }

  set visibility(value: GardenVisibility) {
    this.props.visibility = value
    this.touch()
  }

  get gardenerId() {
    return this.props.gardenerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<GardenProps, "createdAt" | "visibility" | "slug">,
    id?: UniqueEntityId,
  ) {
    const garden = new Garden(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        visibility: props.visibility ?? "public",
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return garden
  }
}

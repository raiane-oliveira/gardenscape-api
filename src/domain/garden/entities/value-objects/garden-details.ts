import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { ValueObject } from "@/core/entities/value-object"
import { Plant } from "../plant"
import { Slug } from "./slug"
import { GardenVisibility } from "../garden"

interface GardenDetailsProps {
  gardenId: UniqueEntityId
  gardener: {
    id: UniqueEntityId
    name: string
    username: string
    imageUrl?: string | null
  }
  name: string
  slug: Slug
  visibility: GardenVisibility
  plants: Plant[]
  createdAt: Date
  updatedAt?: Date | null
}

export class GardenDetails extends ValueObject<GardenDetailsProps> {
  get gardenId() {
    return this.props.gardenId
  }

  get gardener() {
    return this.props.gardener
  }

  get name() {
    return this.props.name
  }

  get slug() {
    return this.props.slug
  }

  get visibility() {
    return this.props.visibility
  }

  get plants() {
    return this.props.plants
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: GardenDetailsProps) {
    return new GardenDetails(props)
  }
}

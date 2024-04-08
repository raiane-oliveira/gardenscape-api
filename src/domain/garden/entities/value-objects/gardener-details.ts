import { ValueObject } from "@/core/entities/value-object"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Garden } from "../garden"

interface GardenerDetailsProps {
  gardenerId: UniqueEntityId
  name: string
  username: string
  email: string
  gardens: Garden[]
  createdAt: Date
  updatedAt?: Date | null
}

export class GardenerDetails extends ValueObject<GardenerDetailsProps> {
  get gardenerId() {
    return this.props.gardenerId
  }

  get name() {
    return this.props.name
  }

  get username() {
    return this.props.username
  }

  get email() {
    return this.props.email
  }

  get gardens() {
    return this.props.gardens
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: GardenerDetailsProps) {
    return new GardenerDetails(props)
  }
}
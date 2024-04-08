import { Entity } from "@/core/entities/entity"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface GardenerProps {
  name: string
  username: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Gardener extends Entity<GardenerProps> {
  get name() {
    return this.props.name
  }

  get username() {
    return this.props.username
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<GardenerProps, "createdAt">,
    id?: UniqueEntityId,
  ) {
    const gardener = new Gardener(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return gardener
  }
}

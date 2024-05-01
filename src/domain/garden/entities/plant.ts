import { Entity } from "@/core/entities/entity"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface PlantProps {
  plantId: string
  plantUrl?: string | null
  gardenId: UniqueEntityId
  plantedAt: Date
}

export class Plant extends Entity<PlantProps> {
  get plantId() {
    return this.props.plantId
  }

  get gardenId() {
    return this.props.gardenId
  }

  get plantedAt() {
    return this.props.plantedAt
  }

  get plantUrl() {
    return this.props.plantUrl
  }

  static create(props: Optional<PlantProps, "plantedAt">, id?: UniqueEntityId) {
    const plant = new Plant(
      {
        ...props,
        plantedAt: props.plantedAt ?? new Date(),
      },
      id,
    )

    return plant
  }
}

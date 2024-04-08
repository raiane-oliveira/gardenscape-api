import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Plant, PlantProps } from "@/domain/garden/entities/plant"
import { randomUUID } from "node:crypto"

export function makePlant(override?: Partial<PlantProps>, id?: UniqueEntityId) {
  const plant = Plant.create(
    {
      plantId: randomUUID(),
      gardenId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return plant
}

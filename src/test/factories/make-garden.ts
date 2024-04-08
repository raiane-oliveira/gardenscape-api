import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Garden, GardenProps } from "@/domain/garden/entities/garden"
import { faker } from "@faker-js/faker"

export function makeGarden(
  override?: Partial<GardenProps>,
  id?: UniqueEntityId,
) {
  const garden = Garden.create(
    {
      name: faker.word.noun(),
      gardenerId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return garden
}

import { Prisma, PlantOnGarden as PrismaPlant } from "@prisma/client"
import { Plant } from "@/domain/garden/entities/plant"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

export class PrismaPlantMapper {
  static toDomain(raw: PrismaPlant): Plant {
    return Plant.create(
      {
        plantId: raw.plantId,
        gardenId: new UniqueEntityId(raw.gardenId),
        plantedAt: raw.plantedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(plant: Plant): Prisma.PlantOnGardenUncheckedCreateInput {
    return {
      plantId: plant.plantId,
      gardenId: plant.gardenId.toString(),
      plantedAt: plant.plantedAt,
    }
  }
}

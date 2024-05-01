import { Prisma, PlantOnGarden as PrismaPlant } from "@prisma/client"
import { Plant } from "@/domain/garden/entities/plant"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

export class PrismaPlantMapper {
  static toDomain(raw: PrismaPlant): Plant {
    return Plant.create(
      {
        plantId: raw.plantId,
        plantUrl: raw.plantUrl,
        gardenId: new UniqueEntityId(raw.gardenId),
        plantedAt: raw.plantedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(plant: Plant): Prisma.PlantOnGardenUncheckedCreateInput {
    return {
      plantId: plant.plantId,
      plantUrl: plant.plantUrl,
      gardenId: plant.gardenId.toString(),
      plantedAt: plant.plantedAt,
    }
  }
}

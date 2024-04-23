import {
  Prisma,
  Garden as PrismaGarden,
  User as PrismaGardener,
  PlantOnGarden as PrismaPlant,
} from "@prisma/client"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Slug } from "@/domain/garden/entities/value-objects/slug"
import { GardenDetails } from "@/domain/garden/entities/value-objects/garden-details"
import { PrismaPlantMapper } from "./prisma-plant-mapper"

export type PrismaGardenDetails = PrismaGarden & {
  user: PrismaGardener
  plantOnGarden: PrismaPlant[]
}

export class PrismaGardenDetailsMapper {
  static toDomain(raw: PrismaGardenDetails): GardenDetails {
    return GardenDetails.create({
      gardenId: new UniqueEntityId(raw.id),
      gardener: {
        id: new UniqueEntityId(raw.userId),
        name: raw.user.name,
        username: raw.user.username,
      },
      plants: raw.plantOnGarden.map(PrismaPlantMapper.toDomain),
      name: raw.name,
      slug: Slug.create(raw.slug),
      visibility: raw.visibility === "PUBLIC" ? "public" : "private",
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }

  static toPrisma(
    gardenDetails: GardenDetails,
  ): Prisma.GardenUncheckedCreateInput {
    return {
      id: gardenDetails.gardenId.toString(),
      name: gardenDetails.name,
      visibility: gardenDetails.visibility === "public" ? "PUBLIC" : "PRIVATE",
      slug: gardenDetails.slug.value,
      userId: gardenDetails.gardener.id.toString(),
    }
  }
}

import { User as PrismaGardener, Garden as PrismaGarden } from "@prisma/client"
import { GardenerDetails } from "@/domain/garden/entities/value-objects/gardener-details"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { PrismaGardenMapper } from "./prisma-garden-mapper"

type PrismaGardenerDetails = PrismaGardener & {
  garden: PrismaGarden[]
}

export class PrismaGardenerDetailsMapper {
  static toDomain(raw: PrismaGardenerDetails): GardenerDetails {
    return GardenerDetails.create({
      gardenerId: new UniqueEntityId(raw.id),
      name: raw.name,
      username: raw.username,
      email: raw.email,
      gardens: raw.garden.map(PrismaGardenMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}

import { Prisma, Garden as PrismaGarden } from "@prisma/client"
import { Garden } from "@/domain/garden/entities/garden"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Slug } from "@/domain/garden/entities/value-objects/slug"

export class PrismaGardenMapper {
  static toDomain(raw: PrismaGarden): Garden {
    return Garden.create(
      {
        gardenerId: new UniqueEntityId(raw.userId),
        name: raw.name,
        slug: Slug.create(raw.slug),
        visibility: raw.visibility === "PUBLIC" ? "public" : "private",
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(garden: Garden): Prisma.GardenUncheckedCreateInput {
    return {
      id: garden.id.toString(),
      name: garden.name,
      visibility: garden.visibility === "public" ? "PUBLIC" : "PRIVATE",
      slug: garden.slug.value,
      userId: garden.gardenerId.toString(),
    }
  }
}

import { User as PrismaGardener, Garden as PrismaGarden } from "@prisma/client"
import { GardenerDetails } from "@/domain/garden/entities/value-objects/gardener-details"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { GardenDetails } from "@/domain/garden/entities/value-objects/garden-details"
import { Slug } from "@/domain/garden/entities/value-objects/slug"
import { GardenVisibility } from "@/domain/garden/entities/garden"

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
      imageUrl: raw.avatarUrlId,
      gardens: raw.garden.map((garden) =>
        GardenDetails.create({
          gardenId: new UniqueEntityId(garden.id),
          name: garden.name,
          slug: Slug.create(garden.slug),
          gardener: {
            id: new UniqueEntityId(raw.id),
            name: raw.name,
            username: raw.username,
            imageUrl: raw.avatarUrlId,
          },
          visibility: garden.visibility.toLowerCase() as GardenVisibility,
          plants: [],
          createdAt: garden.createdAt,
          updatedAt: garden.updatedAt,
        }),
      ),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}

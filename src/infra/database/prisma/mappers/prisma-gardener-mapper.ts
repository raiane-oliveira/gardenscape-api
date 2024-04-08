import { Prisma, User as PrismaGardener } from "@prisma/client"
import { Gardener } from "@/domain/garden/entities/gardener"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

export class PrismaGardenerMapper {
  static toDomain(raw: PrismaGardener): Gardener {
    return Gardener.create(
      {
        name: raw.name,
        username: raw.username,
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(gardener: Gardener): Prisma.UserUncheckedCreateInput {
    return {
      id: gardener.id.toString(),
      name: gardener.name,
      username: gardener.username,
      email: gardener.email,
      password: gardener.password,
    }
  }
}

import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Gardener, GardenerProps } from "@/domain/garden/entities/gardener"
import { PrismaGardenerMapper } from "@/infra/database/prisma/mappers/prisma-gardener-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makeGardener(
  override?: Partial<GardenerProps>,
  id?: UniqueEntityId,
) {
  const name = faker.person.firstName()

  const gardener = Gardener.create(
    {
      name,
      username: faker.internet.userName({
        firstName: name,
        lastName: faker.person.lastName(),
      }),
      email: faker.internet.email(),
      password: faker.internet.password(),
      imageUrl: faker.image.avatar(),
      ...override,
    },
    id,
  )

  return gardener
}

@Injectable()
export class GardenerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaGardener(
    override?: Partial<GardenerProps>,
    id?: UniqueEntityId,
  ): Promise<Gardener> {
    const gardener = makeGardener(override, id)

    await this.prisma.user.create({
      data: PrismaGardenerMapper.toPrisma(gardener),
    })

    return gardener
  }
}

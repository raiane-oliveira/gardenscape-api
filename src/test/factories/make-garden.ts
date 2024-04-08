import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Garden, GardenProps } from "@/domain/garden/entities/garden"
import { PrismaGardenMapper } from "@/infra/database/prisma/mappers/prisma-garden-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

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

@Injectable()
export class GardenFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaGarden(override?: Partial<GardenProps>) {
    const garden = makeGarden(override)

    await this.prisma.garden.create({
      data: PrismaGardenMapper.toPrisma(garden),
    })

    return garden
  }
}

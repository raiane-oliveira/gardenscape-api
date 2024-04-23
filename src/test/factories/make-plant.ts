import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Plant, PlantProps } from "@/domain/garden/entities/plant"
import { PrismaPlantMapper } from "@/infra/database/prisma/mappers/prisma-plant-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { Injectable } from "@nestjs/common"
import { randomUUID } from "node:crypto"

export function makePlant(override?: Partial<PlantProps>, id?: UniqueEntityId) {
  const plant = Plant.create(
    {
      plantId: randomUUID(),
      gardenId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return plant
}

@Injectable()
export class PlantFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPlant(
    override?: Partial<PlantProps>,
    id?: UniqueEntityId,
  ): Promise<Plant> {
    const plant = makePlant(override, id)

    await this.prisma.plantOnGarden.create({
      data: PrismaPlantMapper.toPrisma(plant),
    })

    return plant
  }
}

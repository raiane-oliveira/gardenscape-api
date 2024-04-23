import { Plant } from "@/domain/garden/entities/plant"
import { PlantsRepository } from "@/domain/garden/repositories/plants-repository"
import { PrismaService } from "../prisma.service"
import { PrismaPlantMapper } from "../mappers/prisma-plant-mapper"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaPlantsRepository implements PlantsRepository {
  constructor(private prisma: PrismaService) {}

  async create(plant: Plant): Promise<void> {
    const data = PrismaPlantMapper.toPrisma(plant)

    await this.prisma.plantOnGarden.create({
      data,
    })
  }

  async findManyByGardenId(gardenId: string): Promise<Plant[]> {
    const plants = await this.prisma.plantOnGarden.findMany({
      where: {
        gardenId,
      },
    })

    return plants.map(PrismaPlantMapper.toDomain)
  }

  async findByGardenId(plantId: string, gardenId: string) {
    const plant = await this.prisma.plantOnGarden.findFirst({
      where: {
        plantId,
        gardenId,
      },
    })

    if (!plant) return null

    return PrismaPlantMapper.toDomain(plant)
  }
}

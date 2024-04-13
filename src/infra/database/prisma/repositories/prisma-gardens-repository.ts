import { PaginationParams } from "@/core/repositories/pagination-params"
import { Garden, GardenVisibility } from "@/domain/garden/entities/garden"
import { GardenDetails } from "@/domain/garden/entities/value-objects/garden-details"
import { GardensRepository } from "@/domain/garden/repositories/gardens-repository"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { PrismaGardenMapper } from "../mappers/prisma-garden-mapper"
import { PrismaGardenDetailsMapper } from "../mappers/prisma-garden-details-mapper"

@Injectable()
export class PrismaGardensRepository implements GardensRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Garden | null> {
    const garden = await this.prisma.garden.findUnique({
      where: { id },
    })

    if (!garden) {
      return null
    }

    return PrismaGardenMapper.toDomain(garden)
  }

  async findBySlug(slug: string): Promise<Garden | null> {
    const garden = await this.prisma.garden.findUnique({
      where: { slug },
    })

    if (!garden) {
      return null
    }

    return PrismaGardenMapper.toDomain(garden)
  }

  async findDetailsBySlug(slug: string): Promise<GardenDetails | null> {
    const garden = await this.prisma.garden.findUnique({
      where: { slug },
      include: {
        user: true,
        plantOnGarden: true,
      },
    })

    if (!garden) {
      return null
    }

    return PrismaGardenDetailsMapper.toDomain(garden)
  }

  async findManyByVisibility(
    visibility: GardenVisibility,
    params: PaginationParams,
  ): Promise<Garden[]> {
    const gardens = await this.prisma.garden.findMany({
      where: { visibility: visibility === "private" ? "PRIVATE" : "PUBLIC" },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })

    return gardens.map(PrismaGardenMapper.toDomain)
  }

  async findManyByGardenerId(
    gardenerId: string,
    params: PaginationParams,
  ): Promise<Garden[]> {
    const gardens = await this.prisma.garden.findMany({
      where: { userId: gardenerId },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })

    return gardens.map(PrismaGardenMapper.toDomain)
  }

  async create(garden: Garden): Promise<void> {
    const data = PrismaGardenMapper.toPrisma(garden)

    await this.prisma.garden.create({
      data,
    })
  }

  async delete(garden: Garden): Promise<void> {
    await this.prisma.garden.delete({
      where: {
        id: garden.id.toString(),
      },
    })
  }

  async save(garden: Garden): Promise<void> {
    const data = PrismaGardenMapper.toPrisma(garden)

    await this.prisma.garden.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}

import { Gardener } from "@/domain/garden/entities/gardener"
import { GardenersRepository } from "@/domain/garden/repositories/gardeners-repository"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { PrismaGardenerMapper } from "../mappers/prisma-gardener-mapper"
import { PrismaGardenerDetailsMapper } from "../mappers/prisma-gardener-details-mapper"

@Injectable()
export class PrismaGardenersRepository implements GardenersRepository {
  constructor(private prisma: PrismaService) {}

  async create(gardener: Gardener) {
    const data = PrismaGardenerMapper.toPrisma(gardener)

    await this.prisma.user.create({
      data,
    })
  }

  async save(gardener: Gardener) {
    const data = PrismaGardenerMapper.toPrisma(gardener)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findByEmail(email: string) {
    const gardener = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!gardener) {
      return null
    }

    return PrismaGardenerMapper.toDomain(gardener)
  }

  async findByUsername(username: string) {
    const gardener = await this.prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (!gardener) {
      return null
    }

    return PrismaGardenerMapper.toDomain(gardener)
  }

  async findDetailsByUsername(username: string) {
    const gardenerDetails = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        garden: true,
      },
    })

    if (!gardenerDetails) {
      return null
    }

    return PrismaGardenerDetailsMapper.toDomain(gardenerDetails)
  }
}

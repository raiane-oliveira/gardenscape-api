import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaGardenersRepository } from "./prisma/repositories/prisma-gardeners-repository"
import { GardenersRepository } from "@/domain/garden/repositories/gardeners-repository"
import { GardensRepository } from "@/domain/garden/repositories/gardens-repository"
import { PrismaGardensRepository } from "./prisma/repositories/prisma-gardens-repository"

@Module({
  providers: [
    PrismaService,
    {
      provide: GardenersRepository,
      useClass: PrismaGardenersRepository,
    },
    {
      provide: GardensRepository,
      useClass: PrismaGardensRepository,
    },
  ],
  exports: [PrismaService, GardenersRepository, GardensRepository],
})
export class DatabaseModule {}

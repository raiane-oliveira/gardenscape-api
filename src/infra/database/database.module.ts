import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaGardenersRepository } from "./prisma/repositories/prisma-gardeners-repository"
import { GardenersRepository } from "@/domain/garden/repositories/gardeners-repository"

@Module({
  providers: [
    PrismaService,
    {
      provide: GardenersRepository,
      useClass: PrismaGardenersRepository,
    },
  ],
  exports: [PrismaService, GardenersRepository],
})
export class DatabaseModule {}

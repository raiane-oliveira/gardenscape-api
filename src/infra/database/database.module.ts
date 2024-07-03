import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaGardenersRepository } from "./prisma/repositories/prisma-gardeners-repository"
import { GardenersRepository } from "@/domain/garden/repositories/gardeners-repository"
import { GardensRepository } from "@/domain/garden/repositories/gardens-repository"
import { PrismaGardensRepository } from "./prisma/repositories/prisma-gardens-repository"
import { PlantsRepository } from "@/domain/garden/repositories/plants-repository"
import { PrismaPlantsRepository } from "./prisma/repositories/prisma-plants-repository"
import { SubscriptionsRepository } from "@/domain/billing/repositories/subscriptions-repository"
import { PrismaSubscriptionsRepository } from "./prisma/repositories/prisma-subscriptions-repository"

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
    {
      provide: PlantsRepository,
      useClass: PrismaPlantsRepository,
    },
    {
      provide: SubscriptionsRepository,
      useClass: PrismaSubscriptionsRepository,
    },
  ],
  exports: [
    PrismaService,
    GardenersRepository,
    GardensRepository,
    PlantsRepository,
    SubscriptionsRepository,
  ],
})
export class DatabaseModule {}

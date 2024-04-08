import { Module } from "@nestjs/common"
import { DatabaseModule } from "../database/database.module"
import { GardenersController } from "./controllers/gardeners.controller"
import { AuthenticateGardenerUseCase } from "@/domain/garden/use-cases/authenticate-gardener"
import { RegisterGardenerUseCase } from "@/domain/garden/use-cases/register-gardener"
import { CryptographyModule } from "../cryptography/cryptography.module"

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [GardenersController],
  providers: [AuthenticateGardenerUseCase, RegisterGardenerUseCase],
})
export class HttpModule {}

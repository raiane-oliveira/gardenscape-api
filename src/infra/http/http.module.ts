import { Module } from "@nestjs/common"
import { DatabaseModule } from "../database/database.module"
import { GardenersController } from "./controllers/gardeners.controller"
import { AuthenticateGardenerUseCase } from "@/domain/garden/use-cases/authenticate-gardener"
import { RegisterGardenerUseCase } from "@/domain/garden/use-cases/register-gardener"
import { CryptographyModule } from "../cryptography/cryptography.module"
import { GardensController } from "./controllers/gardens.controller"
import { CreateGardenUseCase } from "@/domain/garden/use-cases/create-garden"
import { EditGardenUseCase } from "@/domain/garden/use-cases/edit-garden"
import { DeleteGardenUseCase } from "@/domain/garden/use-cases/delete-garden"

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [GardenersController, GardensController],
  providers: [
    AuthenticateGardenerUseCase,
    RegisterGardenerUseCase,
    CreateGardenUseCase,
    EditGardenUseCase,
    DeleteGardenUseCase,
  ],
})
export class HttpModule {}

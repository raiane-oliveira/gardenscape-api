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
import { PlantOnGardenUseCase } from "@/domain/garden/use-cases/plant-on-garden"
import { PlantOnGardenController } from "./controllers/plant-on-garden.controller"
import { GetGardenerProfileController } from "./controllers/get-gardener-profile.controller"
import { GetGardenerProfileUseCase } from "@/domain/garden/use-cases/get-gardener-profile"
import { FetchPublicGardensController } from "./controllers/fetch-public-gardens.controller"
import { FetchPublicGardensUseCase } from "@/domain/garden/use-cases/fetch-public-gardens"
import { FetchUserGardensController } from "./controllers/fetch-user-gardens.controller"
import { FetchUserGardensUseCase } from "@/domain/garden/use-cases/fetch-user-gardens"
import { GetUserGardenBySlugUseCase } from "@/domain/garden/use-cases/get-user-garden-by-slug"
import { GetPublicGardenBySlugUseCase } from "@/domain/garden/use-cases/get-public-garden-by-slug"
import { PlantsController } from "./controllers/plants.controller"
import { TrefleApi } from "@/utils/trefle-api"

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    GardenersController,
    GardensController,
    PlantOnGardenController,
    GetGardenerProfileController,
    FetchPublicGardensController,
    FetchUserGardensController,
    PlantsController,
  ],
  providers: [
    AuthenticateGardenerUseCase,
    RegisterGardenerUseCase,
    CreateGardenUseCase,
    EditGardenUseCase,
    DeleteGardenUseCase,
    PlantOnGardenUseCase,
    GetGardenerProfileUseCase,
    FetchPublicGardensUseCase,
    FetchUserGardensUseCase,
    GetUserGardenBySlugUseCase,
    GetPublicGardenBySlugUseCase,
    TrefleApi,
  ],
})
export class HttpModule {}

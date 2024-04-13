import { GetGardenerProfileUseCase } from "@/domain/garden/use-cases/get-gardener-profile"
import { Public } from "@/infra/auth/public"
import { BadRequestException, Controller, Get, Param } from "@nestjs/common"
import { GardenerDetailsPresenter } from "../presenters/gardener-details-presenter"

@Controller()
export class GetGardenerProfileController {
  constructor(private getGardenerProfile: GetGardenerProfileUseCase) {}

  @Get("/gardeners/:username")
  @Public()
  async execute(@Param("username") username: string) {
    const result = await this.getGardenerProfile.execute({
      username,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      gardener: GardenerDetailsPresenter.toHttp(result.value.gardener),
    }
  }
}

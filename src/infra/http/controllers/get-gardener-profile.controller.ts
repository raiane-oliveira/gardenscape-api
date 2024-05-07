import { GetGardenerProfileUseCase } from "@/domain/garden/use-cases/get-gardener-profile"
import { Public } from "@/infra/auth/public"
import { BadRequestException, Controller, Get, Param } from "@nestjs/common"
import { GardenerPresenter } from "../presenters/gardener-presenter"

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
      gardener: GardenerPresenter.toHttp(result.value.gardener),
    }
  }
}

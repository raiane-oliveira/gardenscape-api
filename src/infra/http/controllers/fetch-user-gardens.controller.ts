import { BadRequestException, Controller, Get, Query } from "@nestjs/common"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { GardenPresenter } from "../presenters/garden-presenter"
import { FetchUserGardensUseCase } from "@/domain/garden/use-cases/fetch-user-gardens"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller()
export class FetchUserGardensController {
  constructor(private fetchUserGardens: FetchUserGardensUseCase) {}

  @Get("/user/gardens")
  async handler(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.fetchUserGardens.execute({
      page,
      gardenerId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      gardens: result.value.gardens.map(GardenPresenter.toHttp),
    }
  }
}

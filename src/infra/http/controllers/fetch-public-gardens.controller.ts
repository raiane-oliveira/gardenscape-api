import { Public } from "@/infra/auth/public"
import { BadRequestException, Controller, Get, Query } from "@nestjs/common"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { FetchPublicGardensUseCase } from "@/domain/garden/use-cases/fetch-public-gardens"
import { GardenDetailsPresenter } from "../presenters/garden-details-presenter"

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller()
export class FetchPublicGardensController {
  constructor(private fetchPublicGardens: FetchPublicGardensUseCase) {}

  @Get("/gardens")
  @Public()
  async handler(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchPublicGardens.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      gardens: result.value.gardens.map(GardenDetailsPresenter.toHttp),
    }
  }
}

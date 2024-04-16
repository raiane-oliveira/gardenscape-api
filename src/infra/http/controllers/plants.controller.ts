import { Public } from "@/infra/auth/public"
import { TrefleApi } from "@/utils/trefle-api"
import { Controller, Get, Query } from "@nestjs/common"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller()
export class PlantsController {
  constructor(private trefle: TrefleApi) {}

  @Get("/plants")
  @Public()
  async execute(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const response = await this.trefle.fetch(
      `/species?filter_not[common_name]=null&filter_not[image_url]=null&page=${page}`,
    )

    const data = await response.json()

    return {
      plants: data,
    }
  }
}

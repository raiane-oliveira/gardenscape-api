import { PlantOnGardenUseCase } from "@/domain/garden/use-cases/plant-on-garden"
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UnauthorizedException,
} from "@nestjs/common"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

const plantOnGardenBodySchema = z.object({
  plantId: z.coerce.string(),
})

type PlantOnGardenBodySchema = z.infer<typeof plantOnGardenBodySchema>

@Controller()
export class PlantOnGardenController {
  constructor(private plantOnGarden: PlantOnGardenUseCase) {}

  @Post("/gardens/:gardenId/plant")
  async execute(
    @Body(new ZodValidationPipe(plantOnGardenBodySchema))
    body: PlantOnGardenBodySchema,
    @Param("gardenId") gardenId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { plantId } = body

    const result = await this.plantOnGarden.execute({
      plantId,
      gardenId,
      gardenerId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

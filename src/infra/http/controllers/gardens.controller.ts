import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { GardenVisibility } from "@/domain/garden/entities/garden"
import { CreateGardenUseCase } from "@/domain/garden/use-cases/create-garden"
import { DeleteGardenUseCase } from "@/domain/garden/use-cases/delete-garden"
import { EditGardenUseCase } from "@/domain/garden/use-cases/edit-garden"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from "@nestjs/common"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { GardenPresenter } from "../presenters/garden-presenter"
import { GetUserGardenBySlugUseCase } from "@/domain/garden/use-cases/get-user-garden-by-slug"
import { GardenDetailsPresenter } from "../presenters/garden-details-presenter"
import { Public } from "@/infra/auth/public"
import { GetPublicGardenBySlugUseCase } from "@/domain/garden/use-cases/get-public-garden-by-slug"

const createGardenBodySchema = z.object({
  name: z.string().trim(),
  visibility: z.enum(["public", "private"]).optional().default("public"),
})

const editGardenBodySchema = z.object({
  name: z.string().trim().optional(),
  visibility: z.enum(["public", "private"]).optional(),
})

type CreateGardenBodySchema = z.infer<typeof createGardenBodySchema>
type EditGardenBodySchema = z.infer<typeof editGardenBodySchema>

@Controller("/gardens")
export class GardensController {
  constructor(
    private getPublicGarden: GetPublicGardenBySlugUseCase,
    private getUserGarden: GetUserGardenBySlugUseCase,
    private createGarden: CreateGardenUseCase,
    private deleteGarden: DeleteGardenUseCase,
    private editGarden: EditGardenUseCase,
  ) {}

  @Get("/:slug")
  async getGardenHandler(
    @Param("slug") slug: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.getUserGarden.execute({
      slug,
      gardenerId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      garden: GardenDetailsPresenter.toHttp(result.value.garden),
    }
  }

  @Get("/public/:slug")
  @Public()
  async getPublicGardenHandler(@Param("slug") slug: string) {
    const result = await this.getPublicGarden.execute({
      slug,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      garden: GardenDetailsPresenter.toHttp(result.value.garden),
    }
  }

  @Post()
  async createGardenHandler(
    @Body(new ZodValidationPipe(createGardenBodySchema))
    body: CreateGardenBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, visibility } = body

    const result = await this.createGarden.execute({
      name,
      visibility: visibility as GardenVisibility,
      gardenerId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      garden: GardenPresenter.toHttp(result.value.garden),
    }
  }

  @Put("/:gardenId")
  @HttpCode(204)
  async editGardenHandler(
    @Param("gardenId") gardenId: string,
    @Body(new ZodValidationPipe(editGardenBodySchema))
    body: EditGardenBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, visibility } = body
    const result = await this.editGarden.execute({
      gardenId,
      gardenerId: user.sub,
      name,
      visibility: visibility as GardenVisibility,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException()
        default:
          throw new BadRequestException()
      }
    }
  }

  @Delete("/:gardenId")
  @HttpCode(204)
  async deleteGardenHandler(
    @Param("gardenId") gardenId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.deleteGarden.execute({
      gardenId,
      gardenerId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException()
        default:
          throw new BadRequestException()
      }
    }
  }
}

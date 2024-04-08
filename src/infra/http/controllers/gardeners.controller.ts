import { AuthenticateGardenerUseCase } from "@/domain/garden/use-cases/authenticate-gardener"
import { RegisterGardenerUseCase } from "@/domain/garden/use-cases/register-gardener"
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error"
import { GardenerAlreadyExistsError } from "@/core/errors/gardener-already-exists-error"
import { Public } from "@/infra/auth/public"
import { JwtService } from "@nestjs/jwt"

const authenticateGardenerBodySchema = z.object({
  username: z.string().min(3, "Required").trim(),
  password: z.string().min(6, "Invalid password"),
})

const registerGardenerBodySchema = z.object({
  name: z.string().min(1, "Required").trim(),
  username: z.string().min(3, "Required").trim(),
  email: z.string().email("Invalid e-mail"),
  password: z.string().min(6, "Invalid password").trim(),
})

type AuthenticateGardenerBodySchema = z.infer<
  typeof authenticateGardenerBodySchema
>

type RegisterGardenerBodySchema = z.infer<typeof registerGardenerBodySchema>

@Controller("/gardeners")
@Public()
export class GardenersController {
  constructor(
    private authenticateGardener: AuthenticateGardenerUseCase,
    private registerGardener: RegisterGardenerUseCase,
    private jwtService: JwtService,
  ) {}

  @Post("/authenticate")
  @UsePipes(new ZodValidationPipe(authenticateGardenerBodySchema))
  async authenticationHandler(@Body() body: AuthenticateGardenerBodySchema) {
    const { username, password } = body

    const result = await this.authenticateGardener.execute({
      username,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { gardener } = result.value

    const accessToken = this.jwtService.sign({
      sub: gardener.id.toString(),
      username: gardener.username,
    })

    return {
      access_token: accessToken,
    }
  }

  @Post("/register")
  @UsePipes(new ZodValidationPipe(registerGardenerBodySchema))
  async registerHandler(@Body() body: RegisterGardenerBodySchema) {
    const { name, email, username, password } = body

    const result = await this.registerGardener.execute({
      name,
      email,
      username,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case GardenerAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

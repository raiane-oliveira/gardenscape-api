import { Either, left, right } from "@/core/either"
import { GardenersRepository } from "../../repositories/gardeners-repository"
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error"
import { Gardener } from "../../entities/gardener"
import { HashCompare } from "../../cryptography/hash-compare"
import { Injectable } from "@nestjs/common"

interface AuthenticateGardenerUseCaseRequest {
  username: string
  password: string
}

type AuthenticateGardenerUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    gardener: Gardener
  }
>

@Injectable()
export class AuthenticateGardenerUseCase {
  constructor(
    private gardenersRepository: GardenersRepository,
    private hashCompare: HashCompare,
  ) {}

  async execute({
    username,
    password,
  }: AuthenticateGardenerUseCaseRequest): Promise<AuthenticateGardenerUseCaseResponse> {
    const gardener = await this.gardenersRepository.findByUsername(username)

    if (!gardener) {
      return left(new InvalidCredentialsError())
    }

    const doesPasswordMatches = await this.hashCompare.compare(
      password,
      gardener.password,
    )

    if (!doesPasswordMatches) {
      return left(new InvalidCredentialsError())
    }

    return right({
      gardener,
    })
  }
}

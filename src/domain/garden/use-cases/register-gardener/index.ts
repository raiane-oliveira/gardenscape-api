import { Either, left, right } from "@/core/either"
import { GardenerAlreadyExistsError } from "@/core/errors/gardener-already-exists-error"
import { Gardener } from "../../entities/gardener"
import { GardenersRepository } from "../../repositories/gardeners-repository"
import { HashGenerator } from "../../cryptography/hash-generator"
import { Injectable } from "@nestjs/common"

interface RegisterGardenerUseCaseRequest {
  name: string
  username: string
  email: string
  password: string
}

type RegisterGardenerUseCaseResponse = Either<
  GardenerAlreadyExistsError,
  {
    gardener: Gardener
  }
>

@Injectable()
export class RegisterGardenerUseCase {
  constructor(
    private gardenersRepository: GardenersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    username,
    email,
    password,
  }: RegisterGardenerUseCaseRequest): Promise<RegisterGardenerUseCaseResponse> {
    const gardenerWithSameEmail =
      await this.gardenersRepository.findByEmail(email)

    if (gardenerWithSameEmail) {
      return left(new GardenerAlreadyExistsError(email))
    }

    const gardenerWithSameUsername =
      await this.gardenersRepository.findByUsername(username)

    if (gardenerWithSameUsername) {
      return left(new GardenerAlreadyExistsError(username))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const gardener = Gardener.create({
      name,
      username,
      email,
      password: hashedPassword,
    })

    await this.gardenersRepository.create(gardener)

    return right({
      gardener,
    })
  }
}

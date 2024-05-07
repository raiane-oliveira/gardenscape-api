import { Either, left, right } from "@/core/either"
import { GardenersRepository } from "../../repositories/gardeners-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"
import { Gardener } from "../../entities/gardener"

interface GetGardenerProfileUseCaseRequest {
  username: string
}

type GetGardenerProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    gardener: Gardener
  }
>

@Injectable()
export class GetGardenerProfileUseCase {
  constructor(private gardenersRepository: GardenersRepository) {}

  async execute({
    username,
  }: GetGardenerProfileUseCaseRequest): Promise<GetGardenerProfileUseCaseResponse> {
    const gardener = await this.gardenersRepository.findByUsername(username)

    if (!gardener) {
      return left(new ResourceNotFoundError())
    }

    return right({
      gardener,
    })
  }
}

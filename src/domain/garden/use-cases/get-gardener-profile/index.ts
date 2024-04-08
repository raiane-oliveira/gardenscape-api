import { Either, left, right } from "@/core/either"
import { GardenersRepository } from "../../repositories/gardeners-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { GardenerDetails } from "../../entities/value-objects/gardener-details"

interface GetGardenerProfileUseCaseRequest {
  username: string
}

type GetGardenerProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    gardener: GardenerDetails
  }
>

export class GetGardenerProfileUseCase {
  constructor(private gardenersRepository: GardenersRepository) {}

  async execute({
    username,
  }: GetGardenerProfileUseCaseRequest): Promise<GetGardenerProfileUseCaseResponse> {
    const gardener =
      await this.gardenersRepository.findDetailsByUsername(username)

    if (!gardener) {
      return left(new ResourceNotFoundError())
    }

    return right({
      gardener,
    })
  }
}

import { Either, left, right } from "@/core/either"
import { GardensRepository } from "../../repositories/gardens-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { GardenDetails } from "../../entities/value-objects/garden-details"
import { Injectable } from "@nestjs/common"

interface GetUserGardenBySlugUseCaseRequest {
  slug: string
  gardenerId: string
}

type GetUserGardenBySlugUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    garden: GardenDetails
  }
>

@Injectable()
export class GetUserGardenBySlugUseCase {
  constructor(private gardensRepository: GardensRepository) {}

  async execute({
    slug,
    gardenerId,
  }: GetUserGardenBySlugUseCaseRequest): Promise<GetUserGardenBySlugUseCaseResponse> {
    const garden = await this.gardensRepository.findDetailsBySlug(slug)

    if (!garden) {
      return left(new ResourceNotFoundError())
    }

    if (garden.gardener.id.toString() !== gardenerId) {
      return left(new NotAllowedError())
    }

    return right({
      garden,
    })
  }
}

import { Either, left, right } from "@/core/either"
import { GardensRepository } from "../../repositories/gardens-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { GardenDetails } from "../../entities/value-objects/garden-details"
import { Injectable } from "@nestjs/common"

interface GetPublicGardenBySlugUseCaseRequest {
  slug: string
}

type GetPublicGardenBySlugUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    garden: GardenDetails
  }
>

@Injectable()
export class GetPublicGardenBySlugUseCase {
  constructor(private gardensRepository: GardensRepository) {}

  async execute({
    slug,
  }: GetPublicGardenBySlugUseCaseRequest): Promise<GetPublicGardenBySlugUseCaseResponse> {
    const garden = await this.gardensRepository.findDetailsBySlug(slug)

    if (!garden) {
      return left(new ResourceNotFoundError())
    }

    if (garden.visibility === "private") {
      return left(new NotAllowedError())
    }

    return right({
      garden,
    })
  }
}

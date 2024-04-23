import { Either, right } from "@/core/either"
import { GardensRepository } from "../../repositories/gardens-repository"
import { Injectable } from "@nestjs/common"
import { GardenDetails } from "../../entities/value-objects/garden-details"

interface FetchPublicGardensUseCaseRequest {
  page: number
}

type FetchPublicGardensUseCaseResponse = Either<
  null,
  {
    gardens: GardenDetails[]
  }
>

@Injectable()
export class FetchPublicGardensUseCase {
  constructor(private gardensRepository: GardensRepository) {}

  async execute({
    page,
  }: FetchPublicGardensUseCaseRequest): Promise<FetchPublicGardensUseCaseResponse> {
    const gardens = await this.gardensRepository.findManyByVisibility(
      "public",
      {
        page,
      },
    )

    return right({
      gardens,
    })
  }
}

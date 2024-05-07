import { Either, right } from "@/core/either"
import { GardensRepository } from "../../repositories/gardens-repository"
import { Injectable } from "@nestjs/common"
import { GardenDetails } from "../../entities/value-objects/garden-details"

interface FetchUserGardensUseCaseRequest {
  gardenerId: string
  page: number
}

type FetchUserGardensUseCaseResponse = Either<
  null,
  {
    gardens: GardenDetails[]
  }
>

@Injectable()
export class FetchUserGardensUseCase {
  constructor(private gardensRepository: GardensRepository) {}

  async execute({
    gardenerId,
    page,
  }: FetchUserGardensUseCaseRequest): Promise<FetchUserGardensUseCaseResponse> {
    const gardens = await this.gardensRepository.findManyDetailsByGardenerId(
      gardenerId,
      {
        page,
      },
    )

    return right({
      gardens,
    })
  }
}

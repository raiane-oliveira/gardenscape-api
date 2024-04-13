import { Either, right } from "@/core/either"
import { GardensRepository } from "../../repositories/gardens-repository"
import { Garden } from "../../entities/garden"
import { Injectable } from "@nestjs/common"

interface FetchUserGardensUseCaseRequest {
  gardenerId: string
  page: number
}

type FetchUserGardensUseCaseResponse = Either<
  null,
  {
    gardens: Garden[]
  }
>

@Injectable()
export class FetchUserGardensUseCase {
  constructor(private gardensRepository: GardensRepository) {}

  async execute({
    gardenerId,
    page,
  }: FetchUserGardensUseCaseRequest): Promise<FetchUserGardensUseCaseResponse> {
    const gardens = await this.gardensRepository.findManyByGardenerId(
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

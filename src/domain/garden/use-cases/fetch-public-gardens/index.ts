import { Either, right } from "@/core/either"
import { GardensRepository } from "../../repositories/gardens-repository"
import { Garden } from "../../entities/garden"
import { Injectable } from "@nestjs/common"

interface FetchPublicGardensUseCaseRequest {
  page: number
}

type FetchPublicGardensUseCaseResponse = Either<
  null,
  {
    gardens: Garden[]
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

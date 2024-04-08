import { Either, right } from "@/core/either"
import { GardensRepository } from "../../repositories/gardens-repository"
import { Garden } from "../../entities/garden"

interface FetchPublicGardensUseCaseRequest {
  page: number
}

type FetchPublicGardensUseCaseResponse = Either<
  null,
  {
    gardens: Garden[]
  }
>

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

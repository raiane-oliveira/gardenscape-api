import { GardensRepository } from "../../repositories/gardens-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"

interface DeleteGardenUseCaseRequest {
  gardenId: string
  gardenerId: string
}

type DeleteGardenUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

@Injectable()
export class DeleteGardenUseCase {
  constructor(private gardensRepository: GardensRepository) {}

  async execute({
    gardenId,
    gardenerId,
  }: DeleteGardenUseCaseRequest): Promise<DeleteGardenUseCaseResponse> {
    const garden = await this.gardensRepository.findById(gardenId)

    if (!garden) {
      return left(new ResourceNotFoundError())
    }

    if (garden.gardenerId.toString() !== gardenerId) {
      return left(new NotAllowedError())
    }

    await this.gardensRepository.delete(garden)

    return right({})
  }
}

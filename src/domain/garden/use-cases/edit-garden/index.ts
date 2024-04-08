import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Garden, GardenVisibility } from "../../entities/garden"
import { GardensRepository } from "../../repositories/gardens-repository"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { Either, left, right } from "@/core/either"

interface EditGardenUseCaseRequest {
  gardenId: string
  gardenerId: string
  name?: string
  visibility?: GardenVisibility
}

type EditGardenUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    garden: Garden
  }
>
export class EditGardenUseCase {
  constructor(private gardensRepository: GardensRepository) {}

  async execute({
    name,
    visibility,
    gardenId,
    gardenerId,
  }: EditGardenUseCaseRequest): Promise<EditGardenUseCaseResponse> {
    const garden = await this.gardensRepository.findById(gardenId)

    if (!garden) {
      return left(new ResourceNotFoundError())
    }

    if (garden.gardenerId.toString() !== gardenerId) {
      return left(new NotAllowedError())
    }

    garden.name = name ?? garden.name
    garden.visibility = visibility ?? garden.visibility

    await this.gardensRepository.save(garden)

    return right({
      garden,
    })
  }
}

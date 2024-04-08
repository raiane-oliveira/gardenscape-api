import { Either, left, right } from "@/core/either"
import { PlantsRepository } from "../../repositories/plants-repository"
import { GardensRepository } from "../../repositories/gardens-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { Plant } from "../../entities/plant"

interface PlantOnGardenUseCaseRequest {
  plantId: string
  gardenId: string
  gardenerId: string
}

type PlantOnGardenUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class PlantOnGardenUseCase {
  constructor(
    private plantsRepository: PlantsRepository,
    private gardensRepository: GardensRepository,
  ) {}

  async execute({
    plantId,
    gardenId,
    gardenerId,
  }: PlantOnGardenUseCaseRequest): Promise<PlantOnGardenUseCaseResponse> {
    const garden = await this.gardensRepository.findById(gardenId)

    if (!garden) {
      return left(new ResourceNotFoundError())
    }

    if (garden.gardenerId.toString() !== gardenerId) {
      return left(new NotAllowedError())
    }

    const plant = Plant.create({
      plantId,
      gardenId: garden.id,
    })

    await this.plantsRepository.create(plant)

    return right({})
  }
}

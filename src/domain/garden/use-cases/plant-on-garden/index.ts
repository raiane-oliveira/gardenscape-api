import { Either, left, right } from "@/core/either"
import { PlantsRepository } from "../../repositories/plants-repository"
import { GardensRepository } from "../../repositories/gardens-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { Plant } from "../../entities/plant"
import { Injectable } from "@nestjs/common"
import { PlantAlreadyExistsOnGarden } from "@/core/errors/plant-already-exists-on-garden-error"

interface PlantOnGardenUseCaseRequest {
  plantId: string
  plantUrl?: string | null
  gardenId: string
  gardenerId: string
}

type PlantOnGardenUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

@Injectable()
export class PlantOnGardenUseCase {
  constructor(
    private plantsRepository: PlantsRepository,
    private gardensRepository: GardensRepository,
  ) {}

  async execute({
    plantId,
    plantUrl,
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

    const plantExistOnGarden = await this.plantsRepository.findByGardenId(
      plantId,
      gardenId,
    )

    if (plantExistOnGarden) {
      return left(new PlantAlreadyExistsOnGarden(garden.name))
    }

    const plant = Plant.create({
      plantId,
      plantUrl,
      gardenId: garden.id,
    })

    await this.plantsRepository.create(plant)

    return right({})
  }
}

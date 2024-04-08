import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Garden, GardenVisibility } from "../../entities/garden"
import { GardensRepository } from "../../repositories/gardens-repository"
import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"

interface CreateGardenUseCaseRequest {
  name: string
  visibility?: GardenVisibility
  gardenerId: string
}

type CreateGardenUseCaseResponse = Either<
  null,
  {
    garden: Garden
  }
>

@Injectable()
export class CreateGardenUseCase {
  constructor(private gardensRepository: GardensRepository) {}

  async execute({
    name,
    visibility,
    gardenerId,
  }: CreateGardenUseCaseRequest): Promise<CreateGardenUseCaseResponse> {
    const garden = Garden.create({
      name,
      gardenerId: new UniqueEntityId(gardenerId),
      visibility,
    })

    await this.gardensRepository.create(garden)

    return right({
      garden,
    })
  }
}

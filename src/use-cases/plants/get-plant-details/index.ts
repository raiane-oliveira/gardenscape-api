import { PlantsRepository } from '@/repositories/contracts/plants-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class GetPlantDetailsUseCase {
  constructor(private plantsRepository: PlantsRepository) {}

  async execute(id: number) {
    const plant = await this.plantsRepository.findById(id)

    if (!plant) {
      throw new ResourceNotFoundError()
    }

    return {
      plant,
    }
  }
}

import { PlantCreateInput } from '@/@types/database'
import { PlantsRepository } from '@/repositories/contracts/plants-repository'
import { PlantAlreadyExistsError } from '@/use-cases/errors/plant-already-exists-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class RegisterPlantUseCase {
  constructor(private plantsRepository: PlantsRepository) {}

  async execute({ api_plant_id, name }: PlantCreateInput) {
    if (!api_plant_id) {
      throw new ResourceNotFoundError()
    }

    const plantExists = await this.plantsRepository.findByApiId(api_plant_id)

    if (plantExists) {
      throw new PlantAlreadyExistsError()
    }

    const plant = await this.plantsRepository.create({
      name,
      api_plant_id,
    })

    return {
      plant,
    }
  }
}

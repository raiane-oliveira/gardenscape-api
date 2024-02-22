import { GardensRepository } from '@/repositories/contracts/gardens-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class GetGardenDetailsUseCase {
  constructor(private gardensRepository: GardensRepository) {}

  async execute(gardenId: string) {
    const garden = await this.gardensRepository.findById(gardenId)

    if (!garden) {
      throw new ResourceNotFoundError()
    }

    return {
      garden,
    }
  }
}

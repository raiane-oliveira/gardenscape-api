import { beforeEach, describe, expect, it } from 'vitest'
import { GetPlantDetailsUseCase } from '.'
import { InMemoryPlantsRepository } from '@/repositories/in-memory/in-memory-plants-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let plantsRepository: InMemoryPlantsRepository
let sut: GetPlantDetailsUseCase

describe('Get Plant Details Use Case', () => {
  beforeEach(() => {
    plantsRepository = new InMemoryPlantsRepository()
    sut = new GetPlantDetailsUseCase(plantsRepository)
  })

  it('should be able to get plant details', async () => {
    await plantsRepository.create({
      id: 1,
      api_plant_id: 1,
      name: 'Plant 01',
    })

    const { plant } = await sut.execute(1)

    expect(plant.name).toEqual('Plant 01')
  })

  it('should not be able to get inexistent plant details', async () => {
    await expect(() => sut.execute(1)).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})

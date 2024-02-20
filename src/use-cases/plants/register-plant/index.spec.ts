import { PlantsRepository } from '@/repositories/contracts/plants-repository'
import { RegisterPlantUseCase } from '.'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPlantsRepository } from '@/repositories/in-memory/in-memory-plants-repository'
import { PlantAlreadyExistsError } from '@/use-cases/errors/plant-already-exists-error'

let plantsRepository: PlantsRepository
let sut: RegisterPlantUseCase

describe('Register Plant Use Case', () => {
  beforeEach(() => {
    plantsRepository = new InMemoryPlantsRepository()
    sut = new RegisterPlantUseCase(plantsRepository)
  })

  it('should be able to register a plant', async () => {
    const { plant } = await sut.execute({ name: 'Plant 1', api_plant_id: 1 })

    expect(plant.api_plant_id).toEqual(1)
  })

  it('should not be able to register duplicate plants', async () => {
    await sut.execute({ name: 'Plant 1', api_plant_id: 1 })

    await expect(() =>
      sut.execute({ name: 'Plant 2', api_plant_id: 1 }),
    ).rejects.toBeInstanceOf(PlantAlreadyExistsError)
  })
})

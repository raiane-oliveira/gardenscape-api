import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { GetGardenDetailsUseCase } from '.'
import { InMemoryGardensRepository } from '@/repositories/in-memory/in-memory-gardens-repository'

let gardensRepository: InMemoryGardensRepository
let sut: GetGardenDetailsUseCase

describe('Get Garden Details Use Case', () => {
  beforeEach(() => {
    gardensRepository = new InMemoryGardensRepository()
    sut = new GetGardenDetailsUseCase(gardensRepository)
  })

  it('should be able to get garden details', async () => {
    const gardenCreated = await gardensRepository.create({
      name: 'Garden 01',
      user_id: 'user-01',
    })

    const { garden } = await sut.execute(gardenCreated.id)

    expect(garden.name).toEqual('Garden 01')
  })

  it('should not be able to get inexistent garden details', async () => {
    await expect(() => sut.execute('garden-01')).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})

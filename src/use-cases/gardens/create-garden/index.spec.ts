import { GardensRepository } from '@/repositories/contracts/gardens-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGardensRepository } from '@/repositories/in-memory/in-memory-gardens-repository'
import { CreateGardenUseCase } from '.'
import { UsersRepository } from '@/repositories/contracts/users-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let gardensRepository: GardensRepository
let usersRepository: UsersRepository
let sut: CreateGardenUseCase

describe('Create Garden Use Case', () => {
  beforeEach(() => {
    gardensRepository = new InMemoryGardensRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateGardenUseCase(gardensRepository, usersRepository)
  })

  it('should be able to create a vegetable garden', async () => {
    await usersRepository.create({
      id: 'user-01',
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    })

    const { garden } = await sut.execute({
      name: 'Vegetable Garden',
      userId: 'user-01',
    })

    expect(garden.name).toEqual('Vegetable Garden')
  })

  it('should not be able to create a vegetable garden with inexistent user', async () => {
    await expect(() =>
      sut.execute({
        name: 'Vegetable Garden',
        userId: 'user-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

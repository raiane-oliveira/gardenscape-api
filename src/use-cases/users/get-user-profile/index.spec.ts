import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from '.'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const userCreated = await usersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: await hash('123456', 6),
    })

    const { user } = await sut.execute(userCreated.id)

    expect(user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
        name: 'John Doe',
      }),
    )
  })

  it('should not be able to get inexistent user profile', async () => {
    await expect(() =>
      sut.execute('inexistent-user-id'),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

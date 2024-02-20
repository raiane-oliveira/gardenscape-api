import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from '.'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate user', async () => {
    await usersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.email).toEqual('johndoe@example.com')
  })

  it('should not be able to authenticate user with wrong email', async () => {
    await usersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoewrong@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate user with wrong password', async () => {
    await usersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '1234568',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})

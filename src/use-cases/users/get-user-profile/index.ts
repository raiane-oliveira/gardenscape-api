import { UsersRepository } from '@/repositories/contracts/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}

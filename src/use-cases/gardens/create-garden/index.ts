import {
  GardenInput,
  GardensRepository,
} from '@/repositories/contracts/gardens-repository'
import { UsersRepository } from '@/repositories/contracts/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

interface CreateGardenUseCaseRequest extends Omit<GardenInput, 'user_id'> {
  userId: string
}

export class CreateGardenUseCase {
  constructor(
    private gardensRepository: GardensRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ name, userId, ...data }: CreateGardenUseCaseRequest) {
    if (!name || !userId) {
      throw new ResourceNotFoundError()
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const garden = await this.gardensRepository.create({
      name,
      user_id: userId,
      ...data,
    })

    return {
      garden,
    }
  }
}

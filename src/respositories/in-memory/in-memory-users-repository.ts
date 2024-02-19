import { User } from '@/@types/database'
import { UsersRepository } from '../contracts/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  items: User[] = []

  constructor() {}

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }
}

import { User } from '@/@types/database'
import { UserInput, UsersRepository } from '../contracts/users-repository'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  items: User[] = []

  constructor() {}

  async create(data: UserInput) {
    const user = {
      id: data.id ?? randomUUID(),
      email: data.email,
      password: data.password,
      name: data.name,
      avatar_url: data.avatar_url,
      created_at: data.created_at ?? new Date(),
    }

    this.items.push(user)

    return user
  }

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

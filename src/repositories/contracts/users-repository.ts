import { User, UserCreateInput } from '@/@types/database'

export interface UserInput extends UserCreateInput {
  id?: string
  created_at?: Date
}

export interface UsersRepository {
  create: (data: UserInput) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
  findById: (id: string) => Promise<User | null>
}

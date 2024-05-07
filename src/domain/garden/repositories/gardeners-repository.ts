import { Gardener } from "../entities/gardener"

export abstract class GardenersRepository {
  abstract create(gardener: Gardener): Promise<void>
  abstract save(gardener: Gardener): Promise<void>
  abstract findByEmail(email: string): Promise<null | Gardener>
  abstract findByUsername(username: string): Promise<null | Gardener>
}

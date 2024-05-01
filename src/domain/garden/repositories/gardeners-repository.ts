import { Gardener } from "../entities/gardener"
import { GardenerDetails } from "../entities/value-objects/gardener-details"

export abstract class GardenersRepository {
  abstract create(gardener: Gardener): Promise<void>
  abstract save(gardener: Gardener): Promise<void>
  abstract findByEmail(email: string): Promise<null | Gardener>
  abstract findByUsername(username: string): Promise<null | Gardener>
  abstract findDetailsByUsername(
    username: string,
  ): Promise<null | GardenerDetails>
}

import { Gardener } from "@/domain/garden/entities/gardener"
import { GardenersRepository } from "@/domain/garden/repositories/gardeners-repository"

export class InMemoryGardenersRepository implements GardenersRepository {
  public items: Gardener[] = []

  async create(gardener: Gardener) {
    this.items.push(gardener)
  }

  async save(gardener: Gardener) {
    const gardenerIndex = this.items.findIndex(
      (item) => item.id.toString() === gardener.id.toString(),
    )

    this.items[gardenerIndex] = gardener
  }

  async findByEmail(email: string) {
    const gardener = this.items.find((item) => item.email === email)

    if (!gardener) {
      return null
    }

    return gardener
  }

  async findByUsername(username: string) {
    const gardener = this.items.find((item) => item.username === username)

    if (!gardener) {
      return null
    }

    return gardener
  }
}

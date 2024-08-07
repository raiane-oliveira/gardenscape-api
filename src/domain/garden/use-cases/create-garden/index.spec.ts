import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { CreateGardenUseCase } from "."
import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { InMemoryPlantsRepository } from "@/test/repositories/in-memory-plants-repository"

let gardensRepository: InMemoryGardensRepository
let gardenersRepository: InMemoryGardenersRepository
let plantsRepository: InMemoryPlantsRepository
let sut: CreateGardenUseCase

describe("Create Garden Use Case", () => {
  beforeEach(() => {
    gardensRepository = new InMemoryGardensRepository(
      plantsRepository,
      gardenersRepository,
    )
    sut = new CreateGardenUseCase(gardensRepository)
  })

  it("should be able to create a garden", async () => {
    const result = await sut.execute({
      name: "JavaScript's Garden",
      gardenerId: "gardener-01",
    })

    expect(result.isRight()).toBe(true)

    const garden = result.value?.garden

    expect(garden?.name).toEqual("JavaScript's Garden")
    expect(garden?.gardenerId.toString()).toEqual("gardener-01")
    expect(garden?.visibility).toEqual("public")

    expect(gardensRepository.items).toHaveLength(1)
    expect(gardensRepository.items[0]).toEqual(garden)
  })

  it("should be able to create a private garden", async () => {
    const result = await sut.execute({
      name: "JavaScript's Garden",
      gardenerId: "gardener-01",
      visibility: "private",
    })

    expect(result.isRight()).toBe(true)

    const garden = result.value?.garden

    expect(garden?.visibility).toBe("private")
    expect(gardensRepository.items).toHaveLength(1)
    expect(gardensRepository.items[0]).toEqual(garden)
  })
})

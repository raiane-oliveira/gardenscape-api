import { InMemoryPlantsRepository } from "@/test/repositories/in-memory-plants-repository"
import { PlantOnGardenUseCase } from "."
import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { makeGarden } from "@/test/factories/make-garden"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { PlantAlreadyExistsOnGarden } from "@/core/errors/plant-already-exists-on-garden-error"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let plantsRepository: InMemoryPlantsRepository
let gardensRepository: InMemoryGardensRepository
let sut: PlantOnGardenUseCase

describe("Plant on Garden Use Case", () => {
  beforeEach(() => {
    plantsRepository = new InMemoryPlantsRepository()
    gardensRepository = new InMemoryGardensRepository(plantsRepository)
    sut = new PlantOnGardenUseCase(plantsRepository, gardensRepository)
  })

  it("should be able to plant on garden", async () => {
    const garden = makeGarden()
    gardensRepository.create(garden)

    const result = await sut.execute({
      plantId: "plant-01",
      gardenId: garden.id.toString(),
      gardenerId: garden.gardenerId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(plantsRepository.items).toHaveLength(1)
    expect(plantsRepository.items[0]).toEqual(
      expect.objectContaining({
        plantId: "plant-01",
        gardenId: garden.id,
      }),
    )
  })

  it("should not be able to plant on a inexistent garden", async () => {
    const garden = makeGarden()
    gardensRepository.create(garden)

    const result = await sut.execute({
      plantId: "plant-01",
      gardenId: "inexistent-garden-01",
      gardenerId: garden.gardenerId.toString(),
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value.constructor).toBe(ResourceNotFoundError)
    }
  })

  it("should not be able to plant on garden from another user", async () => {
    const garden = makeGarden()
    gardensRepository.create(garden)

    const result = await sut.execute({
      plantId: "plant-01",
      gardenId: garden.id.toString(),
      gardenerId: "another-user-01",
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value.constructor).toBe(NotAllowedError)
    }
  })

  it("should not be able to plant on same garden twice", async () => {
    const garden = makeGarden({
      gardenerId: new UniqueEntityId("user-01"),
    })
    gardensRepository.create(garden)

    await sut.execute({
      plantId: "plant-01",
      gardenId: garden.id.toString(),
      gardenerId: "user-01",
    })

    const result = await sut.execute({
      plantId: "plant-01",
      gardenId: garden.id.toString(),
      gardenerId: "user-01",
    })

    expect(result.isLeft())
    expect(result.value.constructor).toBe(PlantAlreadyExistsOnGarden)
  })
})

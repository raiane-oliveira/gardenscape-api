import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { EditGardenUseCase } from "."
import { makeGarden } from "@/test/factories/make-garden"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { InMemoryPlantsRepository } from "@/test/repositories/in-memory-plants-repository"

let gardensRepository: InMemoryGardensRepository
let gardenersRepository: InMemoryGardenersRepository
let plantsRepository: InMemoryPlantsRepository
let sut: EditGardenUseCase

describe("Edti garden use case", () => {
  beforeEach(() => {
    gardensRepository = new InMemoryGardensRepository(
      plantsRepository,
      gardenersRepository,
    )
    sut = new EditGardenUseCase(gardensRepository)
  })

  it("should be able to edit a garden", async () => {
    const garden = makeGarden()

    gardensRepository.create(garden)

    const result = await sut.execute({
      gardenId: garden.id.toString(),
      gardenerId: garden.gardenerId.toString(),
      name: "Garden 01",
      visibility: "private",
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.garden.name).toBe("Garden 01")
      expect(result.value.garden.visibility).toBe("private")
    }

    expect(gardensRepository.items[0].visibility).toBe("private")
  })

  it("should not be able edit a garden from another user", async () => {
    const garden = makeGarden()

    gardensRepository.create(garden)

    const result = await sut.execute({
      gardenId: garden.id.toString(),
      gardenerId: "another-user-01",
      name: "Hello Test",
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value.constructor).toBe(NotAllowedError)
    }
  })

  it("should not be able edit a inexistent garden", async () => {
    const result = await sut.execute({
      gardenId: "inexistent-garden-01",
      gardenerId: "another-user-01",
      name: "Hello Test",
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value.constructor).toBe(ResourceNotFoundError)
    }
  })
})

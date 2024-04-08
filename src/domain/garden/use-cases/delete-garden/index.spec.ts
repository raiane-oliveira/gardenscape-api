import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { DeleteGardenUseCase } from "."
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { makeGarden } from "@/test/factories/make-garden"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

let gardensRepository: InMemoryGardensRepository
let sut: DeleteGardenUseCase

describe("Delete Garden Use Case", () => {
  beforeEach(() => {
    gardensRepository = new InMemoryGardensRepository()
    sut = new DeleteGardenUseCase(gardensRepository)
  })

  it("should be able to delete a garden", async () => {
    const garden = makeGarden(
      {
        gardenerId: new UniqueEntityId("user-01"),
      },
      new UniqueEntityId("garden-01"),
    )

    gardensRepository.create(garden)

    const result = await sut.execute({
      gardenId: "garden-01",
      gardenerId: "user-01",
    })

    expect(result.isRight()).toBe(true)
    expect(gardensRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a inexistent garden", async () => {
    const result = await sut.execute({
      gardenId: "1",
      gardenerId: "1",
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value.constructor).toBe(ResourceNotFoundError)
    }
  })

  it("should not be able to delete a garden from another user", async () => {
    const garden = makeGarden(
      {
        gardenerId: new UniqueEntityId("user-01"),
      },
      new UniqueEntityId("garden-01"),
    )

    gardensRepository.create(garden)

    const result = await sut.execute({
      gardenId: "garden-01",
      gardenerId: "user-02",
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value.constructor).toBe(NotAllowedError)
    }
  })
})

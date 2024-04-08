import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { FetchUserGardensUseCase } from "."
import { makeGarden } from "@/test/factories/make-garden"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let gardensRepository: InMemoryGardensRepository
let sut: FetchUserGardensUseCase

describe("Fetch User Gardens Use Case", () => {
  beforeEach(() => {
    gardensRepository = new InMemoryGardensRepository()
    sut = new FetchUserGardensUseCase(gardensRepository)
  })

  it("should be able to fetch user gardens", async () => {
    gardensRepository.create(
      makeGarden({
        name: "garden 1",
        gardenerId: new UniqueEntityId("user-01"),
      }),
    )
    gardensRepository.create(
      makeGarden({
        name: "garden 2",
      }),
    )
    gardensRepository.create(
      makeGarden({
        name: "garden 3",
        visibility: "private",
        gardenerId: new UniqueEntityId("user-01"),
      }),
    )

    const result = await sut.execute({
      page: 1,
      gardenerId: "user-01",
    })

    expect(result.isRight()).toBe(true)

    expect(result.value?.gardens).toHaveLength(2)
    expect(result.value?.gardens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "garden 1",
        }),
        expect.objectContaining({
          name: "garden 3",
        }),
      ]),
    )
  })

  it("should be able to fetch user gardens by page", async () => {
    for (let i = 0; i < 20; i++) {
      gardensRepository.create(makeGarden())
    }

    gardensRepository.create(
      makeGarden({
        gardenerId: new UniqueEntityId("user-01"),
      }),
    )
    gardensRepository.create(
      makeGarden({
        gardenerId: new UniqueEntityId("user-01"),
      }),
    )

    const result = await sut.execute({
      page: 1,
      gardenerId: "user-01",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.gardens).toHaveLength(2)
  })
})

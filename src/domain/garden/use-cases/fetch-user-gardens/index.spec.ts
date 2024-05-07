import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { FetchUserGardensUseCase } from "."
import { makeGarden } from "@/test/factories/make-garden"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { InMemoryPlantsRepository } from "@/test/repositories/in-memory-plants-repository"
import { makeGardener } from "@/test/factories/make-gardener"

let gardensRepository: InMemoryGardensRepository
let gardenersRepository: InMemoryGardenersRepository
let plantsRepository: InMemoryPlantsRepository
let sut: FetchUserGardensUseCase

describe("Fetch User Gardens Use Case", () => {
  beforeEach(() => {
    plantsRepository = new InMemoryPlantsRepository()
    gardenersRepository = new InMemoryGardenersRepository()

    gardensRepository = new InMemoryGardensRepository(
      plantsRepository,
      gardenersRepository,
    )
    sut = new FetchUserGardensUseCase(gardensRepository)
  })

  it("should be able to fetch user gardens", async () => {
    gardenersRepository.create(makeGardener({}, new UniqueEntityId("user-01")))
    gardenersRepository.create(makeGardener({}, new UniqueEntityId("user-02")))

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
    gardenersRepository.create(makeGardener({}, new UniqueEntityId("user-01")))

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

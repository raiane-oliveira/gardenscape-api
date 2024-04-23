import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { FetchPublicGardensUseCase } from "."
import { makeGarden } from "@/test/factories/make-garden"
import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { InMemoryPlantsRepository } from "@/test/repositories/in-memory-plants-repository"
import { makeGardener } from "@/test/factories/make-gardener"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let gardensRepository: InMemoryGardensRepository
let gardenersRepository: InMemoryGardenersRepository
let plantsRepository: InMemoryPlantsRepository
let sut: FetchPublicGardensUseCase

describe("Fetch Public Gardens Use Case", () => {
  beforeEach(() => {
    plantsRepository = new InMemoryPlantsRepository()
    gardenersRepository = new InMemoryGardenersRepository(
      gardensRepository,
      plantsRepository,
    )

    gardensRepository = new InMemoryGardensRepository(
      plantsRepository,
      gardenersRepository,
    )
    sut = new FetchPublicGardensUseCase(gardensRepository)
  })

  it("should be able to fetch public gardens", async () => {
    gardenersRepository.create(makeGardener({}, new UniqueEntityId("user-01")))
    gardenersRepository.create(makeGardener({}, new UniqueEntityId("user-02")))
    gardenersRepository.create(makeGardener({}, new UniqueEntityId("user-03")))

    gardensRepository.create(
      makeGarden({
        name: "garden 1",
        gardenerId: new UniqueEntityId("user-01"),
      }),
    )
    gardensRepository.create(
      makeGarden({
        name: "garden 2",
        gardenerId: new UniqueEntityId("user-02"),
      }),
    )
    gardensRepository.create(
      makeGarden({
        name: "garden 3",
        visibility: "private",
        gardenerId: new UniqueEntityId("user-03"),
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.gardens).toHaveLength(2)
      expect(result.value.gardens).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "garden 1",
          }),
          expect.objectContaining({
            name: "garden 2",
          }),
        ]),
      )
    }
  })

  it("should be able to fetch public gardens by page", async () => {
    gardenersRepository.create(makeGardener({}, new UniqueEntityId("user-01")))
    gardenersRepository.create(makeGardener({}, new UniqueEntityId("user-02")))

    for (let i = 0; i < 20; i++) {
      gardensRepository.create(
        makeGarden({ gardenerId: new UniqueEntityId("user-01") }),
      )
    }

    gardensRepository.create(
      makeGarden({
        gardenerId: new UniqueEntityId("user-02"),
      }),
    )
    gardensRepository.create(
      makeGarden({
        gardenerId: new UniqueEntityId("user-02"),
      }),
    )

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.gardens).toHaveLength(2)
    }
  })
})

import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { FetchPublicGardensUseCase } from "."
import { makeGarden } from "@/test/factories/make-garden"

let gardensRepository: InMemoryGardensRepository
let sut: FetchPublicGardensUseCase

describe("Fetch Public Gardens Use Case", () => {
  beforeEach(() => {
    gardensRepository = new InMemoryGardensRepository()
    sut = new FetchPublicGardensUseCase(gardensRepository)
  })

  it("should be able to fetch public gardens", async () => {
    gardensRepository.create(
      makeGarden({
        name: "garden 1",
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
    for (let i = 0; i < 20; i++) {
      gardensRepository.create(makeGarden())
    }

    gardensRepository.create(makeGarden())
    gardensRepository.create(makeGarden())

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.gardens).toHaveLength(2)
    }
  })
})

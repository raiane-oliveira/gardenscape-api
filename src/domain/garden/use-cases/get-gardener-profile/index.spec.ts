import { GetGardenerProfileUseCase } from "."
import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { makeGardener } from "@/test/factories/make-gardener"

let gardenersRepository: InMemoryGardenersRepository
let sut: GetGardenerProfileUseCase

describe("Get Gardener Details use Case", () => {
  beforeEach(() => {
    gardenersRepository = new InMemoryGardenersRepository()
    sut = new GetGardenerProfileUseCase(gardenersRepository)
  })

  it("should be able to get gardener profile", async () => {
    const gardener = makeGardener({ username: "johndoe" })
    gardenersRepository.create(gardener)

    const result = await sut.execute({
      username: "johndoe",
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.gardener).toEqual(
        expect.objectContaining({
          username: gardener.username,
          imageUrl: gardener.imageUrl,
        }),
      )
    }
  })
})

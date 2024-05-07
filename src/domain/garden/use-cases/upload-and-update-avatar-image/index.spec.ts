import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { UploadAndUpdateAvatarImageUseCase } from "."
import { FakeUploader } from "@/test/storage/uploader"
import { makeGardener } from "@/test/factories/make-gardener"
import { InvalidAttachmentType } from "@/core/errors/invalid-attachment-type-error"

let gardenersRepository: InMemoryGardenersRepository
let fakeUploader: FakeUploader
let sut: UploadAndUpdateAvatarImageUseCase

describe("Upload and Update Avatar Image Use Case", () => {
  beforeEach(() => {
    gardenersRepository = new InMemoryGardenersRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndUpdateAvatarImageUseCase(
      gardenersRepository,
      fakeUploader,
    )
  })

  it("should be able to upload and edit avatar image url", async () => {
    const gardener = makeGardener()
    gardenersRepository.create(gardener)

    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from("image.png"),
      username: gardener.username,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(gardenersRepository.items[0]).toMatchObject({
        imageUrl: result.value.url,
      })
    }

    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toMatchObject({
      fileName: "profile.png",
    })
  })

  it("should not be able to upload a image with wrong format", async () => {
    const gardener = makeGardener()
    gardenersRepository.create(gardener)

    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/gif",
      body: Buffer.from("image.png"),
      username: gardener.username,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})

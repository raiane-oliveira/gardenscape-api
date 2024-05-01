import { Injectable } from "@nestjs/common"
import { GardenersRepository } from "../../repositories/gardeners-repository"
import { Uploader } from "../../storage/uploader"
import { Either, left, right } from "@/core/either"
import { InvalidAttachmentType } from "@/core/errors/invalid-attachment-type-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

interface UploadAndUpdateAvatarImageUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
  username: string
}

type UploadAndUpdateAvatarImageUseCaseResponse = Either<
  InvalidAttachmentType | ResourceNotFoundError | NotAllowedError,
  { url: string }
>

@Injectable()
export class UploadAndUpdateAvatarImageUseCase {
  constructor(
    private gardenersRepository: GardenersRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
    username,
  }: UploadAndUpdateAvatarImageUseCaseRequest): Promise<UploadAndUpdateAvatarImageUseCaseResponse> {
    const gardener = await this.gardenersRepository.findByUsername(username)

    if (!gardener) {
      return left(new ResourceNotFoundError())
    }

    if (gardener.username !== username) {
      return left(new NotAllowedError())
    }

    const validFileTypeRegex = new RegExp(/^(image\/(jpeg|png|jpg))/)

    if (!validFileTypeRegex.test(fileType)) {
      return left(new InvalidAttachmentType(fileType))
    }

    const { url } = await this.uploader.upload({
      fileType,
      fileName,
      body,
    })

    gardener.imageUrl = url

    await this.gardenersRepository.save(gardener)

    return right({ url })
  }
}

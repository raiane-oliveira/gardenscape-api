import { UploadAndUpdateAvatarImageUseCase } from "@/domain/garden/use-cases/upload-and-update-avatar-image"
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"

@Controller()
export class UploadGardenerAvatarController {
  constructor(
    private uploadAndUpdateAvatarImage: UploadAndUpdateAvatarImageUseCase,
  ) {}

  @Post("/gardeners/:username/upload-avatar")
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5, // 5mb
          }),
          new FileTypeValidator({
            fileType: ".(png|jpg|jpeg)",
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param("username") username: string,
  ) {
    const result = await this.uploadAndUpdateAvatarImage.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
      username,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    const { url } = result.value

    return {
      url,
    }
  }
}

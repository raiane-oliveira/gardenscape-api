import { UploadParams, Uploader } from "@/domain/garden/storage/uploader"
import { randomUUID } from "crypto"

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  uploads: Upload[] = []

  async upload({ fileName }: UploadParams) {
    const url = fileName.concat(`-uploaded-${randomUUID()}`)

    this.uploads.push({
      fileName,
      url,
    })

    return {
      url,
    }
  }
}

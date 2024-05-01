import { UploadParams, Uploader } from "@/domain/garden/storage/uploader"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Env } from "../env"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { randomUUID } from "crypto"

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: ConfigService<Env, true>) {
    const accountId = this.envService.get("CLOUDFLARE_ACCOUNT_ID")

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: "auto",
      credentials: {
        accessKeyId: envService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: envService.get("AWS_SECRET_ACCESS_KEY"),
      },
    })
  }

  async upload({ fileName, fileType, body }: UploadParams) {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get("AWS_BUCKET_NAME"),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
}

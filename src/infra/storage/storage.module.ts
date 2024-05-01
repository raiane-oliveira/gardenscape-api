import { Uploader } from "@/domain/garden/storage/uploader"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { R2Storage } from "./r2-storage"

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}

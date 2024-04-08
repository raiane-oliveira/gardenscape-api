import { Module } from "@nestjs/common"
import { BcryptHasher } from "./bcrypt-hasher"
import { HashCompare } from "@/domain/garden/cryptography/hash-compare"
import { HashGenerator } from "@/domain/garden/cryptography/hash-generator"

@Module({
  providers: [
    {
      provide: HashCompare,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [HashCompare, HashGenerator],
})
export class CryptographyModule {}

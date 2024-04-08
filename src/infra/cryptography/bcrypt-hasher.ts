import { HashCompare } from "@/domain/garden/cryptography/hash-compare"
import { HashGenerator } from "@/domain/garden/cryptography/hash-generator"
import { hash, compare } from "bcryptjs"

export class BcryptHasher implements HashGenerator, HashCompare {
  private HASH_SALT_LENGTH = 8

  async hash(plainText: string) {
    return await hash(plainText, this.HASH_SALT_LENGTH)
  }

  async compare(plainText: string, hash: string) {
    return await compare(plainText, hash)
  }
}

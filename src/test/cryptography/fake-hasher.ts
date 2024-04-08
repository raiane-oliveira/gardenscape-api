import { HashCompare } from "@/domain/garden/cryptography/hash-compare"
import { HashGenerator } from "@/domain/garden/cryptography/hash-generator"

export class FakeHasher implements HashGenerator, HashCompare {
  async hash(plainText: string) {
    return plainText.concat("-hashed")
  }

  async compare(plainText: string, hash: string) {
    return plainText.concat("-hashed") === hash
  }
}

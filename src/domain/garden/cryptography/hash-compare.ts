export abstract class HashCompare {
  abstract compare(plainText: string, hash: string): Promise<boolean>
}

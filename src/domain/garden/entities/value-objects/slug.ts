import { randomUUID } from "node:crypto"

export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a string and normalize it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    // normalize => padroniza a string removendo ou substituindo caracteres especiais pelas suas respectivas letras/código
    const textTransformed = text
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // s == white space
      .replace(/[^\w-]+/g, "")
      .replace(/_/g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/g, "")

    const slugText = textTransformed.concat(`-${randomUUID()}`)

    return new Slug(slugText)
  }
}

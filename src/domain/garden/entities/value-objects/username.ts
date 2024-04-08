export class Username {
  private value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new Username(value)
  }

  /**
   * Receives a string and normalize it as a username
   *
   * Example: "raIaNe/32?oliveira" => "raiane32oliveira"
   *
   * @param text {string}
   * */
  static createFromText(text: string) {
    // TODO: finish username value object class
    const usernameText = text.trim().toLowerCase()
  }
}

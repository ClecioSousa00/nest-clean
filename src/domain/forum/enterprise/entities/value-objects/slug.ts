export class Slug {
  value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  static createFromText(text: string) {
    const slugText = text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/[^\w-]+/g, '') // Remove caracteres especiais

    return new Slug(slugText)
  }
}

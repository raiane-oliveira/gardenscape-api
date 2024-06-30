import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Product, ProductProps } from "@/domain/billing/entities/product"
import { faker } from "@faker-js/faker"

export function makeProduct(
  override?: Partial<ProductProps>,
  id?: UniqueEntityId,
) {
  const product = Product.create(
    {
      name: faker.word.words(2),
      description: faker.finance.transactionDescription(),
      price: faker.number.int(),
      ...override,
    },
    id,
  )

  return product
}

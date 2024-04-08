import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { GardenerDetails } from "./gardener-details"
import { Slug } from "./slug"
import { Garden } from "../garden"

test("it should be able to create a gardener with details", () => {
  const gardener = GardenerDetails.create({
    gardenerId: new UniqueEntityId("gardener-01"),
    name: "John Doe",
    username: "johndoe",
    email: "johndoe@gmail.com",
    createdAt: new Date(),
    gardens: [
      Garden.create(
        {
          name: "Javascript",
          gardenerId: new UniqueEntityId("gardener-01"),
          slug: Slug.create("javascript"),
          visibility: "public",
          createdAt: new Date(),
        },
        new UniqueEntityId("garden-01"),
      ),
    ],
  })

  expect(gardener.name).toEqual("John Doe")
  expect(gardener.gardens).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: new UniqueEntityId("garden-01"),
        name: "Javascript",
      }),
    ]),
  )
})

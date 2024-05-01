import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { GardenerDetails } from "./gardener-details"
import { Slug } from "./slug"
import { GardenDetails } from "./garden-details"

test("it should be able to create a gardener with details", () => {
  const gardener = GardenerDetails.create({
    gardenerId: new UniqueEntityId("gardener-01"),
    name: "John Doe",
    username: "johndoe",
    email: "johndoe@gmail.com",
    imageUrl: "",
    createdAt: new Date(),
    gardens: [
      GardenDetails.create({
        gardenId: new UniqueEntityId("garden-01"),
        name: "Javascript",
        gardener: {
          id: new UniqueEntityId("gardener-01"),
          name: "John Doe",
          username: "johndoe",
        },
        slug: Slug.create("javascript"),
        visibility: "public",
        plants: [],
        createdAt: new Date(),
        updatedAt: null,
      }),
    ],
  })

  expect(gardener.name).toEqual("John Doe")
  expect(gardener.gardens).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        gardenId: new UniqueEntityId("garden-01"),
        name: "Javascript",
      }),
    ]),
  )
})

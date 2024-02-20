import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGardensRepository } from '@/repositories/in-memory/in-memory-gardens-repository'
import { CreateReminderUseCase } from '.'
import { InMemoryRemindersRepository } from '@/repositories/in-memory/in-memory-reminders-repository'
import { InMemoryPlantsRepository } from '@/repositories/in-memory/in-memory-plants-repository'
import { ReminderAlreadyExistsError } from '@/use-cases/errors/reminder-already-exists-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let gardensRepository: InMemoryGardensRepository
let remindersRepository: InMemoryRemindersRepository
let plantsRepository: InMemoryPlantsRepository
let sut: CreateReminderUseCase

describe('Create Garden Use Case', () => {
  beforeEach(() => {
    gardensRepository = new InMemoryGardensRepository()
    remindersRepository = new InMemoryRemindersRepository()
    plantsRepository = new InMemoryPlantsRepository()

    sut = new CreateReminderUseCase(
      remindersRepository,
      plantsRepository,
      gardensRepository,
    )
  })

  it('should be able to create a plant reminder', async () => {
    await gardensRepository.create({
      id: 'garden-01',
      name: 'Garden 01',
      user_id: 'user-01',
    })

    await plantsRepository.create({
      id: 1,
      name: 'Plant 01',
      api_plant_id: 1,
    })

    const { reminder } = await sut.execute({
      datetime: new Date('2024-02-26 09:00:00'),
      garden_id: 'garden-01',
      plant_id: 1,
    })

    expect(reminder.datetime).toEqual(new Date('2024-02-26 09:00:00'))
  })

  it('should not be able to create a duplicate reminder', async () => {
    await gardensRepository.create({
      id: 'garden-01',
      name: 'Garden 01',
      user_id: 'user-01',
    })

    await plantsRepository.create({
      id: 1,
      name: 'Plant 01',
      api_plant_id: 1,
    })

    await sut.execute({
      datetime: new Date('2024-02-26 09:00:00'),
      garden_id: 'garden-01',
      plant_id: 1,
    })

    await expect(() =>
      sut.execute({
        datetime: new Date('2024-02-26 09:00:00'),
        garden_id: 'garden-01',
        plant_id: 1,
      }),
    ).rejects.toBeInstanceOf(ReminderAlreadyExistsError)
  })

  it('should be able to create multiple reminders', async () => {
    await gardensRepository.create({
      id: 'garden-01',
      name: 'Garden 01',
      user_id: 'user-01',
    })

    await plantsRepository.create({
      id: 1,
      name: 'Plant 01',
      api_plant_id: 1,
    })

    await plantsRepository.create({
      id: 2,
      name: 'Plant 02',
      api_plant_id: 2,
    })

    await sut.execute({
      datetime: new Date('2024-02-26 09:00:00'),
      garden_id: 'garden-01',
      plant_id: 1,
    })

    await sut.execute({
      datetime: new Date('2024-02-26 09:00:00'),
      garden_id: 'garden-01',
      plant_id: 2,
    })

    expect(remindersRepository.items).toHaveLength(2)
  })

  it('should not be able to create reminders with invalid garden', async () => {
    await plantsRepository.create({
      id: 1,
      name: 'Plant 01',
      api_plant_id: 1,
    })

    await expect(() =>
      sut.execute({
        datetime: new Date('2024-02-26 09:00:00'),
        garden_id: 'garden-01',
        plant_id: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create reminders with invalid plant', async () => {
    await gardensRepository.create({
      id: 'garden-01',
      name: 'Garden 01',
      user_id: 'user-01',
    })

    await expect(() =>
      sut.execute({
        datetime: new Date('2024-02-26 09:00:00'),
        garden_id: 'garden-01',
        plant_id: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

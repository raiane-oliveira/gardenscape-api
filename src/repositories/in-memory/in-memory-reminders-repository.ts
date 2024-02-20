import { Reminder } from '@/@types/database'
import {
  CreateReminderInput,
  RemindersRepository,
} from '../contracts/reminders-repository'
import { randomInt } from 'crypto'

export class InMemoryRemindersRepository implements RemindersRepository {
  items: Reminder[] = []

  async create(data: CreateReminderInput) {
    const reminder: Reminder = {
      id: data.id ?? randomInt(100),
      ...data,
      created_at: data.created_at ?? new Date(),
    }

    this.items.push(reminder)

    return reminder
  }

  async findByGardenAndPlantId(gardenId: string, plantId: number) {
    const reminder = this.items.find(
      (item) => item.plant_id === plantId && item.garden_id === gardenId,
    )

    if (!reminder) {
      return null
    }

    return reminder
  }
}

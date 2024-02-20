import { Reminder, ReminderCreateInput } from '@/@types/database'

export interface CreateReminderInput extends ReminderCreateInput {
  id?: number
  created_at?: Date
}

export interface RemindersRepository {
  create: (data: CreateReminderInput) => Promise<Reminder>
  findByGardenAndPlantId: (
    gardenId: string,
    plantId: number,
  ) => Promise<Reminder | null>
}

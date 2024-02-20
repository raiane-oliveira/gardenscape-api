import { ReminderCreateInput } from '@/@types/database'
import { GardensRepository } from '@/repositories/contracts/gardens-repository'
import { PlantsRepository } from '@/repositories/contracts/plants-repository'
import { RemindersRepository } from '@/repositories/contracts/reminders-repository'
import { ReminderAlreadyExistsError } from '@/use-cases/errors/reminder-already-exists-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class CreateReminderUseCase {
  constructor(
    private remindersRepository: RemindersRepository,
    private plantsRepository: PlantsRepository,
    private gardensRepository: GardensRepository,
  ) {}

  async execute({ datetime, garden_id, plant_id }: ReminderCreateInput) {
    const plantExists = await this.plantsRepository.findById(plant_id)
    const gardenExists = await this.gardensRepository.findById(garden_id)

    if (!plantExists || !gardenExists) {
      throw new ResourceNotFoundError()
    }

    const reminderExists =
      await this.remindersRepository.findByGardenAndPlantId(garden_id, plant_id)

    if (
      reminderExists &&
      reminderExists.datetime.getTime() === datetime.getTime()
    ) {
      throw new ReminderAlreadyExistsError()
    }

    const reminder = await this.remindersRepository.create({
      datetime,
      plant_id,
      garden_id,
    })

    return {
      reminder,
    }
  }
}

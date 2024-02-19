export interface User {
  id: string
  name: string
  email: string
  password: string
  avatar_url?: string
  created_at: Date
}

export type UserCreateInput = Omit<Omit<User, 'id'>, 'created_at'>

export interface Garden {
  id: string
  name: string
  user_id: string
  created_at: Date
}

export type GardenCreateInput = Omit<Omit<Garden, 'id'>, 'created_at'>

export interface Plant {
  id: number
  api_plant_id: number
  name: string
}

export type PlantCreateInput = Omit<Plant, 'id'>

export interface Reminder {
  id: number
  datetime: Date
  plant_id: number
  created_at: Date
}

export type ReminderCreateInput = Omit<Omit<Reminder, 'id'>, 'created_at'>

export interface PlantsGarden {
  plant_id: number
  garden_id: string
  added_at: Date
}

export type PlantsGardenCreateInput = Omit<PlantsGarden, 'id'>

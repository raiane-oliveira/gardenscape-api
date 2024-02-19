export interface User {
  id: string
  name: string
  email: string
  password: string
  avatar_url?: string
  created_at: Date
}

export interface Garden {
  id: string
  name: string
  user_id: string
  created_at: Date
}

export interface Plant {
  id: number
  api_plant_id: number
  name: string
}

export interface Reminder {
  id: number
  datetime: Date
  plant_id: number
  created_at: Date
}

export interface PlantsGarden {
  plant_id: number
  garden_id: string
  created_at: Date
}

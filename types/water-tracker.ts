export type WaterEntry = {
  id: string
  amount: number
  timestamp: number
  cupSize: number
}

export type DailyRecord = {
  date: string
  entries: WaterEntry[]
  total: number
}

export type CupSize = {
  id: string
  size: number
  label: string
}


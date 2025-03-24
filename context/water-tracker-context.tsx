"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"
import type { WaterEntry, DailyRecord, CupSize } from "@/types/water-tracker"
import { getLocalStorage, setLocalStorage } from "@/utils/local-storage"

// Default cup sizes
const defaultCupSizes: CupSize[] = [
  { id: "1", size: 250, label: "Small (250ml)" },
  { id: "2", size: 500, label: "Medium (500ml)" },
  { id: "3", size: 750, label: "Large (750ml)" },
]

// Default daily target
const DEFAULT_DAILY_TARGET = 2500

type WaterTrackerContextType = {
  dailyTarget: number
  setDailyTarget: (target: number) => void
  cupSizes: CupSize[]
  setCupSizes: (sizes: CupSize[]) => void
  selectedCupSize: string
  setSelectedCupSize: (id: string) => void
  history: DailyRecord[]
  todayTotal: number
  goalReached: boolean
  addWaterEntry: () => void
  addCustomCupSize: (size: number, label: string) => void
  removeCupSize: (id: string) => void
  formatTime: (timestamp: number) => string
  formatDate: (dateString: string) => string
}

const WaterTrackerContext = createContext<WaterTrackerContextType | undefined>(undefined)

export function WaterTrackerProvider({ children }: { children: ReactNode }) {
  const [dailyTarget, setDailyTarget] = useState<number>(DEFAULT_DAILY_TARGET)
  const [cupSizes, setCupSizes] = useState<CupSize[]>(defaultCupSizes)
  const [selectedCupSize, setSelectedCupSize] = useState<string>("1")
  const [history, setHistory] = useState<DailyRecord[]>([])
  const [todayTotal, setTodayTotal] = useState<number>(0)
  const [goalReached, setGoalReached] = useState<boolean>(false)
  const { toast } = useToast()

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedTarget = getLocalStorage("waterTarget")
    const storedCupSizes = getLocalStorage("cupSizes")
    const storedHistory = getLocalStorage("waterHistory")

    if (storedTarget) setDailyTarget(Number.parseInt(storedTarget))
    if (storedCupSizes) setCupSizes(JSON.parse(storedCupSizes))
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory) as DailyRecord[]
      setHistory(parsedHistory)

      // Calculate today's total
      const today = format(new Date(), "yyyy-MM-dd")
      const todayRecord = parsedHistory.find((record) => record.date === today)
      if (todayRecord) {
        setTodayTotal(todayRecord.total)
      } else {
        setTodayTotal(0)
      }
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    setLocalStorage("waterTarget", dailyTarget.toString())
    setLocalStorage("cupSizes", JSON.stringify(cupSizes))
    setLocalStorage("waterHistory", JSON.stringify(history))
  }, [dailyTarget, cupSizes, history])

  // Check if goal is reached
  useEffect(() => {
    if (todayTotal >= dailyTarget && !goalReached) {
      setGoalReached(true)

      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Show toast notification
      toast({
        title: "Goal Reached! 🎉",
        description: `Congratulations! You've reached your daily water intake goal of ${dailyTarget}ml.`,
      })
    } else if (todayTotal < dailyTarget && goalReached) {
      // Reset the goal reached state if the target is adjusted or entries are removed
      setGoalReached(false)
    }
  }, [todayTotal, dailyTarget, goalReached, toast])

  // Add water entry
  const addWaterEntry = () => {
    const selectedCup = cupSizes.find((cup) => cup.id === selectedCupSize)
    if (!selectedCup) return

    const amount = selectedCup.size
    const today = format(new Date(), "yyyy-MM-dd")
    const newEntry: WaterEntry = {
      id: Date.now().toString(),
      amount,
      timestamp: Date.now(),
      cupSize: amount,
    }

    // Update history
    const updatedHistory = [...history]
    const todayIndex = updatedHistory.findIndex((record) => record.date === today)

    if (todayIndex >= 0) {
      // Update existing record for today
      updatedHistory[todayIndex].entries.push(newEntry)
      updatedHistory[todayIndex].total += amount
      setTodayTotal(updatedHistory[todayIndex].total)
    } else {
      // Create new record for today
      updatedHistory.push({
        date: today,
        entries: [newEntry],
        total: amount,
      })
      setTodayTotal(amount)
    }

    // Check if this entry exactly hits the target
    const updatedTotal = todayIndex >= 0 ? updatedHistory[todayIndex].total : amount
    if (updatedTotal === dailyTarget) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 300)
    }

    setHistory(updatedHistory)
  }

  // Add custom cup size
  const addCustomCupSize = (size: number, label: string) => {
    if (size <= 0 || !label.trim()) return

    const newCupSize: CupSize = {
      id: Date.now().toString(),
      size,
      label: `${label} (${size}ml)`,
    }

    setCupSizes([...cupSizes, newCupSize])
  }

  // Remove cup size
  const removeCupSize = (id: string) => {
    setCupSizes(cupSizes.filter((cup) => cup.id !== id))
  }

  // Format timestamp to time
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), "HH:mm")
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "EEEE, MMMM d, yyyy")
  }

  const value = {
    dailyTarget,
    setDailyTarget,
    cupSizes,
    setCupSizes,
    selectedCupSize,
    setSelectedCupSize,
    history,
    todayTotal,
    goalReached,
    addWaterEntry,
    addCustomCupSize,
    removeCupSize,
    formatTime,
    formatDate,
  }

  return <WaterTrackerContext.Provider value={value}>{children}</WaterTrackerContext.Provider>
}

export function useWaterTracker() {
  const context = useContext(WaterTrackerContext)
  if (context === undefined) {
    throw new Error("useWaterTracker must be used within a WaterTrackerProvider")
  }
  return context
}


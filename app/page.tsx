"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Settings, History, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"

// Types
type WaterEntry = {
  id: string
  amount: number
  timestamp: number
  cupSize: number
}

type DailyRecord = {
  date: string
  entries: WaterEntry[]
  total: number
}

type CupSize = {
  id: string
  size: number
  label: string
}

// Default cup sizes
const defaultCupSizes: CupSize[] = [
  { id: "1", size: 250, label: "Small (250ml)" },
  { id: "2", size: 500, label: "Medium (500ml)" },
  { id: "3", size: 750, label: "Large (750ml)" },
]

export default function WaterTracker() {
  // State
  const [dailyTarget, setDailyTarget] = useState<number>(2500)
  const [cupSizes, setCupSizes] = useState<CupSize[]>(defaultCupSizes)
  const [selectedCupSize, setSelectedCupSize] = useState<string>("1")
  const [customCupSize, setCustomCupSize] = useState<number>(0)
  const [customCupLabel, setCustomCupLabel] = useState<string>("")
  const [history, setHistory] = useState<DailyRecord[]>([])
  const [todayTotal, setTodayTotal] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>("tracker")

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedTarget = localStorage.getItem("waterTarget")
    const storedCupSizes = localStorage.getItem("cupSizes")
    const storedHistory = localStorage.getItem("waterHistory")

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
    localStorage.setItem("waterTarget", dailyTarget.toString())
    localStorage.setItem("cupSizes", JSON.stringify(cupSizes))
    localStorage.setItem("waterHistory", JSON.stringify(history))
  }, [dailyTarget, cupSizes, history])

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

    setHistory(updatedHistory)
  }

  // Add custom cup size
  const addCustomCupSize = () => {
    if (customCupSize <= 0 || !customCupLabel.trim()) return

    const newCupSize: CupSize = {
      id: Date.now().toString(),
      size: customCupSize,
      label: `${customCupLabel} (${customCupSize}ml)`,
    }

    setCupSizes([...cupSizes, newCupSize])
    setCustomCupSize(0)
    setCustomCupLabel("")
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Droplets className="h-6 w-6 text-blue-500" />
            Water Tracker
          </CardTitle>
          <CardDescription>Track your daily water consumption</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="tracker">Tracker</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Progress</CardTitle>
              <CardDescription>
                {todayTotal} ml of {dailyTarget} ml goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(todayTotal / dailyTarget) * 100} className="h-4" />

              <div className="mt-6">
                <Label htmlFor="cup-size">Select cup size</Label>
                <Select value={selectedCupSize} onValueChange={setSelectedCupSize}>
                  <SelectTrigger id="cup-size" className="mt-2">
                    <SelectValue placeholder="Select cup size" />
                  </SelectTrigger>
                  <SelectContent>
                    {cupSizes.map((cup) => (
                      <SelectItem key={cup.id} value={cup.id}>
                        {cup.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addWaterEntry} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Water
              </Button>
            </CardFooter>
          </Card>

          {history.length > 0 && history.find((record) => record.date === format(new Date(), "yyyy-MM-dd")) && (
            <Card>
              <CardHeader>
                <CardTitle>Today's Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history
                    .find((record) => record.date === format(new Date(), "yyyy-MM-dd"))
                    ?.entries.sort((a, b) => b.timestamp - a.timestamp)
                    .map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center p-2 border rounded">
                        <div className="flex items-center">
                          <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                          <span>{entry.amount} ml</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatTime(entry.timestamp)}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Consumption History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-6">
                  {history
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => (
                      <div key={record.date} className="space-y-2">
                        <div className="font-medium">{formatDate(record.date)}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Total: {record.total} ml ({Math.round((record.total / dailyTarget) * 100)}% of target)
                        </div>
                        <Progress value={(record.total / dailyTarget) * 100} className="h-2 mb-4" />

                        <div className="space-y-2">
                          {record.entries
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map((entry) => (
                              <div
                                key={entry.id}
                                className="flex justify-between items-center p-2 border rounded text-sm"
                              >
                                <div className="flex items-center">
                                  <Droplets className="h-3 w-3 text-blue-500 mr-2" />
                                  <span>{entry.amount} ml</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No history available yet. Start tracking your water intake!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="daily-target">Daily Target (ml)</Label>
                <Input
                  id="daily-target"
                  type="number"
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(Number.parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Cup Sizes</h3>
                <div className="space-y-2 mb-4">
                  {cupSizes.map((cup) => (
                    <div key={cup.id} className="flex justify-between items-center p-2 border rounded">
                      <span>{cup.label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCupSizes(cupSizes.filter((c) => c.id !== cup.id))}
                        className="h-8 text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Custom Cup Size
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Custom Cup Size</DialogTitle>
                      <DialogDescription>Create a new cup size for tracking your water intake.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="cup-label">Cup Name</Label>
                        <Input
                          id="cup-label"
                          placeholder="e.g., My Water Bottle"
                          value={customCupLabel}
                          onChange={(e) => setCustomCupLabel(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cup-size">Size (ml)</Label>
                        <Input
                          id="cup-size"
                          type="number"
                          placeholder="e.g., 750"
                          value={customCupSize || ""}
                          onChange={(e) => setCustomCupSize(Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addCustomCupSize}>Add Cup Size</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


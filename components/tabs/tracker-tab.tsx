"use client"

import { format } from "date-fns"
import { PlusCircle, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWaterTracker } from "@/context/water-tracker-context"
import WaterProgressBar from "@/components/water-progress-bar"

export default function TrackerTab() {
  const { dailyTarget, todayTotal, cupSizes, selectedCupSize, setSelectedCupSize, addWaterEntry, history, formatTime } =
    useWaterTracker()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
          <CardDescription>
            {todayTotal} ml of {dailyTarget} ml goal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WaterProgressBar value={(todayTotal / dailyTarget) * 100} />

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
        <Card className="mt-4">
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
    </>
  )
}


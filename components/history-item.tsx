"use client"

import { Droplets } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useWaterTracker } from "@/context/water-tracker-context"
import type { DailyRecord } from "@/types/water-tracker"

interface HistoryItemProps {
  record: DailyRecord
  dailyTarget: number
}

export default function HistoryItem({ record, dailyTarget }: HistoryItemProps) {
  const { formatDate, formatTime } = useWaterTracker()

  return (
    <div className="space-y-2">
      <div className="font-medium">{formatDate(record.date)}</div>
      <div className="text-sm text-muted-foreground mb-2">
        Total: {record.total} ml ({Math.round((record.total / dailyTarget) * 100)}% of target)
      </div>
      <Progress value={(record.total / dailyTarget) * 100} className="h-2 mb-4" />

      <div className="space-y-2">
        {record.entries
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((entry) => (
            <div key={entry.id} className="flex justify-between items-center p-2 border rounded text-sm">
              <div className="flex items-center">
                <Droplets className="h-3 w-3 text-blue-500 mr-2" />
                <span>{entry.amount} ml</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</span>
            </div>
          ))}
      </div>
    </div>
  )
}


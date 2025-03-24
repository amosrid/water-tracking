"use client"

import { History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWaterTracker } from "@/context/water-tracker-context"
import HistoryItem from "@/components/history-item"

export default function HistoryTab() {
  const { history, dailyTarget } = useWaterTracker()

  return (
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
                <HistoryItem key={record.date} record={record} dailyTarget={dailyTarget} />
              ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No history available yet. Start tracking your water intake!
          </div>
        )}
      </CardContent>
    </Card>
  )
}


"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Droplets, Home, History, Settings } from "lucide-react"
import { useState } from "react"
import { Toaster } from "@/components/ui/toaster"

import TrackerTab from "@/components/tabs/tracker-tab"
import HistoryTab from "@/components/tabs/history-tab"
import SettingsTab from "@/components/tabs/settings-tab"
import GoalCelebration from "@/components/goal-celebration"
import { useWaterTracker } from "@/context/water-tracker-context"

export default function WaterTrackerApp() {
  const [activeTab, setActiveTab] = useState<string>("tracker")
  const { goalReached, dailyTarget } = useWaterTracker()

  return (
    <div className="container mx-auto px-4 py-4 max-w-md">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            Water Tracker
          </CardTitle>
          <CardDescription>Track your daily water consumption</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col min-h-[calc(100vh-8rem)]">
        <div className="flex-grow">
          <TabsContent value="tracker" className="space-y-4 mt-0">
            <TrackerTab />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <SettingsTab />
          </TabsContent>
        </div>

        <TabsList className="grid grid-cols-3 mt-4 sticky bottom-4 z-10 mx-auto">
          <TabsTrigger value="tracker" className="flex flex-col py-2 px-0">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex flex-col py-2 px-0">
            <History className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col py-2 px-0">
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <GoalCelebration show={goalReached} target={dailyTarget} />
      <Toaster />
    </div>
  )
}


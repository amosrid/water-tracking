"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Droplets, Home, History, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"

import TrackerTab from "@/components/tabs/tracker-tab"
import HistoryTab from "@/components/tabs/history-tab"
import SettingsTab from "@/components/tabs/settings-tab"
import GoalCelebration from "@/components/goal-celebration"
import { useWaterTracker } from "@/context/water-tracker-context"
import InstallPrompt from "@/components/install-prompt"

export default function WaterTrackerApp() {
  const [activeTab, setActiveTab] = useState<string>("tracker")
  const { goalReached, dailyTarget } = useWaterTracker()
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if the app is already installed
    const isInStandaloneMode = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://")

    setIsStandalone(isInStandaloneMode())

    // Show install prompt after 3 seconds if not installed
    if (!isInStandaloneMode()) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-4 max-w-md min-h-screen flex flex-col">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            Water Tracker
          </CardTitle>
          <CardDescription>Track your daily water consumption</CardDescription>
        </CardHeader>
      </Card>

      <div className="flex-grow">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
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

          <TabsList className="grid grid-cols-3 mt-4 fixed bottom-4 left-4 right-4 z-10 max-w-md mx-auto">
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
      </div>

      {showInstallPrompt && !isStandalone && <InstallPrompt onDismiss={() => setShowInstallPrompt(false)} />}

      <GoalCelebration show={goalReached} target={dailyTarget} />
      <Toaster />
    </div>
  )
}


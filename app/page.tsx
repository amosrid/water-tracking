"use client"

import { useEffect } from "react"
import { WaterTrackerProvider } from "@/context/water-tracker-context"
import WaterTrackerApp from "@/components/water-tracker-app"
import registerServiceWorker from "./sw"

export default function Home() {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <WaterTrackerProvider>
      <WaterTrackerApp />
    </WaterTrackerProvider>
  )
}


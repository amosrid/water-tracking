"use client"

import { useWaterTracker } from "@/context/water-tracker-context"

interface WaterProgressBarProps {
  value: number
}

export default function WaterProgressBar({ value }: WaterProgressBarProps) {
  const { goalReached } = useWaterTracker()

  // Ensure value is between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100)

  return (
    <div className="relative h-4 overflow-hidden rounded-full bg-blue-100">
      <div
        className={`absolute inset-0 bg-blue-500 transition-all duration-1000 ease-out ${
          goalReached ? "animate-water-fill" : ""
        }`}
        style={{
          width: `${clampedValue}%`,
          transform: goalReached ? "translateY(0%)" : `translateY(${100 - clampedValue}%)`,
        }}
      />
      {goalReached && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-md">Goal Reached!</span>
        </div>
      )}
    </div>
  )
}


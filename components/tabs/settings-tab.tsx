"use client"

import { useState } from "react"
import { PlusCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWaterTracker } from "@/context/water-tracker-context"

export default function SettingsTab() {
  const { dailyTarget, setDailyTarget, cupSizes, addCustomCupSize, removeCupSize } = useWaterTracker()
  const [customCupSize, setCustomCupSize] = useState<number>(0)
  const [customCupLabel, setCustomCupLabel] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddCustomCupSize = () => {
    addCustomCupSize(customCupSize, customCupLabel)
    setCustomCupSize(0)
    setCustomCupLabel("")
    setDialogOpen(false)
  }

  return (
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
                  onClick={() => removeCupSize(cup.id)}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <Button onClick={handleAddCustomCupSize}>Add Cup Size</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

